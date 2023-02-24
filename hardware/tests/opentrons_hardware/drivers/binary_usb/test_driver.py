"""USB Driver tests."""
import serial  # type: ignore[import]
import time
from contextlib import ExitStack
import multiprocessing
import os
import pty
from selectors import DefaultSelector as Selector, EVENT_READ
import tty
import io
from opentrons_hardware.drivers.binary_usb import SerialUsbDriver

from typing import AsyncGenerator, List
import pytest
import asyncio
from opentrons_hardware.firmware_bindings.messages.binary_message_definitions import Ack


def run(primary_files_fd: List[int], primary_files_obj: List[io.FileIO]) -> None:
    """Creates several serial ports.

    When data is received from one port, sends to all the other ports.
    """
    print(type(primary_files_obj[0]))
    primary_files = {}

    for i in range(2):
        primary_files[primary_files_fd[i]] = primary_files_obj[i]

    with Selector() as selector, ExitStack() as stack:
        # Context manage all the primary file objects, and add to selector.
        for fd, f in primary_files.items():
            stack.enter_context(f)
            selector.register(fd, EVENT_READ)
        while True:
            for key, events in selector.select():
                if not events & EVENT_READ:
                    continue

                data = primary_files[int(key.fd)].read()
                # Write to primary files.
                for fd, f in primary_files.items():
                    # Don't write to the sending file.
                    if fd != key.fileobj:
                        f.write(data)


class SerialEmulator(object):
    """Test fixture for emulating serial connections."""

    def __init__(
        self,
    ) -> None:
        """Open some serial ports to simulate the usb connection."""
        self.primary_files_fd = []  # Dict of primary fd to primary file object.
        self.primary_files = []
        self.secondary_names = []  # Dict of primary fd to secondary name.
        for i in range(2):
            primary_fd, secondary_fd = pty.openpty()
            tty.setraw(primary_fd)
            os.set_blocking(primary_fd, False)
            secondary_name = os.ttyname(secondary_fd)
            self.primary_files_fd.append(primary_fd)
            self.primary_files.append(open(primary_fd, "r+b", buffering=0))
            self.secondary_names.append(secondary_name)

        self.device_port = self.secondary_names[0]
        self.client_port = self.secondary_names[1]
        self.proc = multiprocessing.Process(
            target=run, args=(self.primary_files_fd, self.primary_files)
        )
        self.proc.start()
        time.sleep(1)
        self.serial = serial.Serial(
            self.device_port, 9600, rtscts=True, dsrdtr=True, timeout=1
        )
        self.err = ""
        self.out = ""

    def write(self, out: bytes) -> int:
        """Write some bytes to the serial port."""
        return int(self.serial.write(out))

    def read(self) -> bytes:
        """Read some bytes from the serial port."""
        line = bytes("", "utf-8")
        while self.serial.inWaiting() > 0:
            line += self.serial.read(1)
        return line

    def __del__(self) -> None:
        self.stop()

    def stop(self) -> None:
        """Disconnect and remove the serial ports."""
        self.proc.terminate()


@pytest.fixture
def test_port_host() -> SerialEmulator:
    """Fixture for the serial emulator."""
    return SerialEmulator()


@pytest.fixture
def test_port_client(test_port_host: SerialEmulator) -> serial.Serial:
    """Fixture for the serial port that will get passed to the driver."""
    return serial.Serial(
        test_port_host.client_port, 9600, rtscts=True, dsrdtr=True, timeout=1
    )


@pytest.fixture
async def subject(
    test_port_client: serial.Serial, test_port_host: SerialEmulator
) -> AsyncGenerator[SerialUsbDriver, None]:
    """The binary driver under test."""
    driver = SerialUsbDriver(asyncio.get_running_loop())
    driver.connect("Emulation port", test_port_client)
    yield driver
    driver.__exit__()
    test_port_host.stop()


async def test_send(subject: SerialUsbDriver, test_port_host: SerialEmulator) -> None:
    """Test sending data with the usb driver."""
    m = Ack()
    length = await subject.write(m)
    assert length == 4

    recieved = test_port_host.read()

    assert recieved == b"\x00\x01\x00\x00"


async def test_recv(subject: SerialUsbDriver, test_port_host: SerialEmulator) -> None:
    """Test receiving and parsing data from the USB driver."""
    length = test_port_host.write(b"\x00\x01\x00\x00")
    assert length == 4
    message = await subject.read()
    assert type(message) == Ack

    assert message == Ack()
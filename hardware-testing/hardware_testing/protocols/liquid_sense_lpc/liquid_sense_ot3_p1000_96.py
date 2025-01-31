"""Liquid sense OT3 P1000."""
from opentrons.protocol_api import ProtocolContext

metadata = {"protocolName": "liquid-sense-ot3-p1000-96"}
requirements = {"robotType": "Flex", "apiLevel": "2.15"}

SLOT_SCALE = 4
SLOT_DIAL = 5
SLOTS_TIPRACK = {
    # TODO: add slot 12 when tipracks are disposable
    50: [2, 3, 6, 7, 8, 9, 10, 11],
    200: [2, 3, 6, 7, 8, 9, 10, 11],  # NOTE: ignored during calibration
    1000: [2, 3, 6, 7, 8, 9, 10, 11],  # NOTE: ignored during calibration
}

LABWARE_ON_SCALE = "nest_1_reservoir_195ml"


def run(ctx: ProtocolContext) -> None:
    """Run."""
    tipracks = [
        ctx.load_labware(f"opentrons_flex_96_tiprack_{size}uL_adp", slot)
        for size, slots in SLOTS_TIPRACK.items()
        for slot in slots
        if size == 50  # only calibrate 50ul tip-racks
    ]
    scale_labware = ctx.load_labware(LABWARE_ON_SCALE, SLOT_SCALE)
    pipette = ctx.load_instrument("p1000_96", "left")
    for rack in tipracks:
        pipette.pick_up_tip(rack["A1"])
        pipette.aspirate(10, scale_labware["A1"].top())
        pipette.dispense(10, scale_labware["A1"].top())
        pipette.drop_tip(home_after=False)

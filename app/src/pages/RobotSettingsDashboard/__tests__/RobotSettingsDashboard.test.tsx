import * as React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { fireEvent } from '@testing-library/react'

import { renderWithProviders } from '@opentrons/components'

import { i18n } from '../../../i18n'
import { getRobotSettings } from '../../../redux/robot-settings'
import { getLocalRobot } from '../../../redux/discovery'
import { toggleDevtools, toggleHistoricOffsets } from '../../../redux/config'
import { mockConnectedRobot } from '../../../redux/discovery/__fixtures__'
import { Navigation } from '../../../organisms/Navigation'
import {
  DeviceReset,
  TouchScreenSleep,
  TouchscreenBrightness,
  NetworkSettings,
  Privacy,
  RobotSystemVersion,
  UpdateChannel,
} from '../../../organisms/RobotSettingsDashboard'
import { getRobotUpdateAvailable } from '../../../redux/robot-update'
import { useNetworkConnection } from '../../../resources/networking/hooks/useNetworkConnection'
import { useLEDLights } from '../../../organisms/Devices/hooks'

import { RobotSettingsDashboard } from '../../../pages/RobotSettingsDashboard'

jest.mock('../../../redux/discovery')
jest.mock('../../../redux/robot-update')
jest.mock('../../../redux/config')
jest.mock('../../../redux/robot-settings')
jest.mock('../../../resources/networking/hooks/useNetworkConnection')
jest.mock('../../../organisms/Navigation')
jest.mock('../../../organisms/RobotSettingsDashboard/TouchScreenSleep')
jest.mock('../../../organisms/RobotSettingsDashboard/NetworkSettings')
jest.mock('../../../organisms/RobotSettingsDashboard/DeviceReset')
jest.mock('../../../organisms/RobotSettingsDashboard/Privacy')
jest.mock('../../../organisms/RobotSettingsDashboard/RobotSystemVersion')
jest.mock('../../../organisms/RobotSettingsDashboard/TouchscreenBrightness')
jest.mock('../../../organisms/RobotSettingsDashboard/UpdateChannel')
jest.mock('../../../organisms/Devices/hooks')

const mockToggleLights = jest.fn()

const mockGetLocalRobot = getLocalRobot as jest.MockedFunction<
  typeof getLocalRobot
>
const mockGetRobotSettings = getRobotSettings as jest.MockedFunction<
  typeof getRobotSettings
>
const mockToggleDevtools = toggleDevtools as jest.MockedFunction<
  typeof toggleDevtools
>
const mockToggleHistoricOffsets = toggleHistoricOffsets as jest.MockedFunction<
  typeof toggleHistoricOffsets
>
const mockNavigation = Navigation as jest.MockedFunction<typeof Navigation>
const mockTouchScreenSleep = TouchScreenSleep as jest.MockedFunction<
  typeof TouchScreenSleep
>
const mockNetworkSettings = NetworkSettings as jest.MockedFunction<
  typeof NetworkSettings
>
const mockDeviceReset = DeviceReset as jest.MockedFunction<typeof DeviceReset>
const mockPrivacy = Privacy as jest.MockedFunction<typeof Privacy>
const mockRobotSystemVersion = RobotSystemVersion as jest.MockedFunction<
  typeof RobotSystemVersion
>
const mockTouchscreenBrightness = TouchscreenBrightness as jest.MockedFunction<
  typeof TouchscreenBrightness
>
const mockUpdateChannel = UpdateChannel as jest.MockedFunction<
  typeof UpdateChannel
>
const mockUseLEDLights = useLEDLights as jest.MockedFunction<
  typeof useLEDLights
>
const mockGetBuildrootUpdateAvailable = getRobotUpdateAvailable as jest.MockedFunction<
  typeof getRobotUpdateAvailable
>
const mockUseNetworkConnection = useNetworkConnection as jest.MockedFunction<
  typeof useNetworkConnection
>

const render = () => {
  return renderWithProviders(
    <MemoryRouter>
      <RobotSettingsDashboard />
    </MemoryRouter>,
    {
      i18nInstance: i18n,
    }
  )
}

// Note kj 01/25/2023 Currently test cases only check text since this PR is bare-bones for RobotSettings Dashboard
describe('RobotSettingsDashboard', () => {
  beforeEach(() => {
    mockGetLocalRobot.mockReturnValue(mockConnectedRobot)
    mockNavigation.mockReturnValue(<div>Mock Navigation</div>)
    mockTouchScreenSleep.mockReturnValue(<div>Mock Touchscreen Sleep</div>)
    mockNetworkSettings.mockReturnValue(<div>Mock Network Settings</div>)
    mockDeviceReset.mockReturnValue(<div>Mock Device Reset</div>)
    mockPrivacy.mockReturnValue(<div>Mock Privacy</div>)
    mockRobotSystemVersion.mockReturnValue(<div>Mock Robot System Version</div>)
    mockGetRobotSettings.mockReturnValue([
      {
        id: 'disableHomeOnBoot',
        title: 'Disable home on boot',
        description: 'Prevent robot from homing motors on boot',
        restart_required: false,
        value: true,
      },
    ])
    mockTouchscreenBrightness.mockReturnValue(
      <div>Mock Touchscreen Brightness</div>
    )
    mockUpdateChannel.mockReturnValue(<div>Mock Update Channel</div>)
    mockUseLEDLights.mockReturnValue({
      lightsEnabled: false,
      toggleLights: mockToggleLights,
    })
    mockUseNetworkConnection.mockReturnValue({} as any)
  })

  it('should render Navigation', () => {
    const [{ getByText }] = render()
    getByText('Mock Navigation')
  })

  it('should render setting buttons', () => {
    const [{ getByText }] = render()
    getByText('Robot Name')
    getByText('opentrons-robot-name')
    getByText('Robot System Version')
    getByText('Network Settings')
    getByText('Status LEDs')
    getByText('Control the strip of color lights on the front of the robot.')
    getByText('Touchscreen Sleep')
    getByText('Touchscreen Brightness')
    getByText('Privacy')
    getByText('Choose what data to share with Opentrons.')
    getByText('Device Reset')
    getByText('Update Channel')
    getByText('Apply Labware Offsets')
    getByText('Use stored data when setting up a protocol.')
    getByText('Developer Tools')
    getByText('Access additional logging and feature flags.')
  })

  it('should render component when tapping robot name button', () => {
    const [{ getByText }] = render()
    const button = getByText('Robot Name')
    fireEvent.click(button)
    getByText('Robot Name')
  })

  it('should render component when tapping robot system version', () => {
    const [{ getByText }] = render()
    const button = getByText('Robot System Version')
    fireEvent.click(button)
    getByText('Mock Robot System Version')
  })

  it('should render text with lights off and clicking it, calls useLEDLights', () => {
    const [{ getByText }] = render()
    const lights = getByText('Status LEDs')
    fireEvent.click(lights)
    expect(mockToggleLights).toHaveBeenCalled()
  })

  it('should render text with lights on', () => {
    mockUseLEDLights.mockReturnValue({
      lightsEnabled: true,
      toggleLights: mockToggleLights,
    })
    const [{ getByTestId }] = render()
    expect(
      getByTestId('RobotSettingButton_display_led_lights')
    ).toHaveTextContent('On')
  })

  it('should render component when tapping network settings', () => {
    const [{ getByText }] = render()
    const button = getByText('Network Settings')
    fireEvent.click(button)
    getByText('Mock Network Settings')
  })

  it('should render component when tapping display touchscreen sleep', () => {
    const [{ getByText }] = render()
    const button = getByText('Touchscreen Sleep')
    fireEvent.click(button)
    getByText('Mock Touchscreen Sleep')
  })

  it('should render component when tapping touchscreen brightness', () => {
    const [{ getByText }] = render()
    const button = getByText('Touchscreen Brightness')
    fireEvent.click(button)
    getByText('Mock Touchscreen Brightness')
  })

  it('should render component when tapping privacy', () => {
    const [{ getByText }] = render()
    const button = getByText('Privacy')
    fireEvent.click(button)
    getByText('Mock Privacy')
  })

  it('should render component when tapping device rest', () => {
    const [{ getByText }] = render()
    const button = getByText('Device Reset')
    fireEvent.click(button)
    getByText('Mock Device Reset')
  })

  it('should render component when tapping update channel', () => {
    const [{ getByText }] = render()
    const button = getByText('Update Channel')
    fireEvent.click(button)
    getByText('Mock Update Channel')
  })

  it('should render text with home gantry off', () => {
    mockGetRobotSettings.mockReturnValue([
      {
        id: 'disableHomeOnBoot',
        title: 'Disable home on boot',
        description: 'Prevent robot from homing motors on boot',
        restart_required: false,
        value: false,
      },
    ])
    const [{ getByTestId }] = render()
    expect(
      getByTestId('RobotSettingButton_home_gantry_on_restart')
    ).toHaveTextContent('On')
  })

  it('should call a mock function when tapping enable historic offset', () => {
    const [{ getByText }] = render()
    const button = getByText('Apply Labware Offsets')
    fireEvent.click(button)
    expect(mockToggleHistoricOffsets).toHaveBeenCalled()
  })

  it('should call a mock function when tapping enable dev tools', () => {
    const [{ getByText }] = render()
    const button = getByText('Developer Tools')
    fireEvent.click(button)
    expect(mockToggleDevtools).toHaveBeenCalled()
  })

  it('should return an update available with correct text', () => {
    mockGetBuildrootUpdateAvailable.mockReturnValue('upgrade')
    const [{ getByText }] = render()
    getByText('Update available')
  })
})
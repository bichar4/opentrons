import * as React from 'react'

import { renderWithProviders } from '@opentrons/components'

import { i18n } from '../../../i18n'
import { getIsOnDevice } from '../../../redux/config'
import { EstopPressedModal } from '../EstopPressedModal'

jest.mock('../../../redux/config')

const mockGetIsOnDevice = getIsOnDevice as jest.MockedFunction<
  typeof getIsOnDevice
>

const render = (props: React.ComponentProps<typeof EstopPressedModal>) => {
  return renderWithProviders(<EstopPressedModal {...props} />, {
    i18nInstance: i18n,
  })
}

describe('EstopPressedModal - Touchscreen', () => {
  let props: React.ComponentProps<typeof EstopPressedModal>

  beforeEach(() => {
    props = {
      isEngaged: true,
      closeModal: jest.fn(),
    }
    mockGetIsOnDevice.mockReturnValue(true)
  })

  it('should render text and button', () => {
    const [{ getByText, getByTestId }] = render(props)
    getByText('E-stop pressed')
    getByText('E-stop')
    getByText('Engaged')
    getByText(
      'First, safely clear the deck of any labware or spills. Then, twist the E-stop button counterclockwise. Finally, have Flex move the gantry to its home position.'
    )
    getByText('Resume robot operations')
    expect(getByTestId('Estop_pressed_button')).toBeDisabled()
  })

  it('should resume robot operation button is not disabled', () => {
    props.isEngaged = false
    const [{ getByText, getByTestId }] = render(props)
    getByText('E-stop')
    getByText('Disengaged')
    getByText('Resume robot operations')
    expect(getByTestId('Estop_pressed_button')).not.toBeDisabled()
  })

  it.todo('should call a mock function when clicking resume robot operations')
})

describe('EstopPressedModal - Desktop', () => {
  let props: React.ComponentProps<typeof EstopPressedModal>

  beforeEach(() => {
    props = {
      isEngaged: true,
      closeModal: jest.fn(),
    }
    mockGetIsOnDevice.mockReturnValue(false)
  })
  it('should render text and button', () => {
    const [{ getByText, getByRole }] = render(props)
    getByText('E-stop pressed')
    getByText('E-stop Engaged')
    getByText(
      'First, safely clear the deck of any labware or spills. Then, twist the E-stop button counterclockwise. Finally, have Flex move the gantry to its home position.'
    )
    expect(
      getByRole('button', { name: 'Resume robot operations' })
    ).toBeDisabled()
  })

  it('should resume robot operation button is not disabled', () => {
    props.isEngaged = false
    const [{ getByRole }] = render(props)
    expect(
      getByRole('button', { name: 'Resume robot operations' })
    ).not.toBeDisabled()
  })

  it('should call a mock function when clicking close icon', () => {
    const [{ getByTestId }] = render(props)
    getByTestId('ModalHeader_icon_close_E-stop pressed').click()
    expect(props.closeModal).toBeCalled()
  })

  it.todo('should call a mock function when clicking resume robot operations')
})
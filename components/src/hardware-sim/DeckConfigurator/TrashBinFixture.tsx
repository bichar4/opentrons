import * as React from 'react'

import {
  getDeckDefFromRobotType,
  FLEX_ROBOT_TYPE,
} from '@opentrons/shared-data'

import { Icon } from '../../icons'
import { Btn, Flex, Text } from '../../primitives'
import { ALIGN_CENTER, DISPLAY_FLEX, JUSTIFY_CENTER } from '../../styles'
import { BORDERS, COLORS, SPACING, TYPOGRAPHY } from '../../ui-style-constants'
import { RobotCoordsForeignObject } from '../Deck/RobotCoordsForeignObject'

// TODO: replace stubs with JSON definitions when available
const trashBinDef = {
  schemaVersion: 1,
  version: 1,
  namespace: 'opentrons',
  metadata: {
    displayName: 'Trash',
  },
  parameters: {
    loadName: 'trash_bin',
  },
  boundingBox: {
    xDimension: 246.5,
    yDimension: 106.0,
    zDimension: 0,
  },
}

interface TrashBinFixtureProps {
  fixtureLocation: string
  handleClickRemove?: (fixtureLocation: string) => void
}

export function TrashBinFixture(props: TrashBinFixtureProps): JSX.Element {
  const { handleClickRemove, fixtureLocation } = props
  const deckDef = getDeckDefFromRobotType(FLEX_ROBOT_TYPE)

  // TODO: migrate to fixture location for v4
  const trashBinSlot = deckDef.locations.orderedSlots.find(
    slot => slot.id === fixtureLocation
  )
  const [xSlotPosition = 0, ySlotPosition = 0] = trashBinSlot?.position ?? []
  // TODO: remove adjustment when reading from fixture position
  // adjust x differently for right side/left side
  const isLeftSideofDeck =
    fixtureLocation === 'A1' ||
    fixtureLocation === 'B1' ||
    fixtureLocation === 'C1' ||
    fixtureLocation === 'D1'
  const xAdjustment = isLeftSideofDeck ? -101.5 : -17
  const x = xSlotPosition + xAdjustment
  const yAdjustment = -10
  const y = ySlotPosition + yAdjustment

  const { xDimension, yDimension } = trashBinDef.boundingBox

  return (
    <RobotCoordsForeignObject
      width={xDimension}
      height={yDimension}
      x={x}
      y={y}
      flexProps={{ flex: '1' }}
      foreignObjectProps={{ flex: '1' }}
    >
      <Flex
        alignItems={ALIGN_CENTER}
        backgroundColor={COLORS.grey2}
        borderRadius={BORDERS.radiusSoftCorners}
        color={COLORS.white}
        gridGap={SPACING.spacing8}
        justifyContent={JUSTIFY_CENTER}
        width="100%"
      >
        {}
        <Text css={TYPOGRAPHY.bodyTextSemiBold}>
          {trashBinDef.metadata.displayName}
        </Text>
        {handleClickRemove != null ? (
          <Btn
            display={DISPLAY_FLEX}
            justifyContent={JUSTIFY_CENTER}
            onClick={() => handleClickRemove(fixtureLocation)}
          >
            <Icon name="remove" color={COLORS.white} height="2.25rem" />
          </Btn>
        ) : null}
      </Flex>
    </RobotCoordsForeignObject>
  )
}
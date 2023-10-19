import * as React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Form, Formik, useFormikContext } from 'formik'
import {
  BUTTON_TYPE_SUBMIT,
  OutlineButton,
  ModalShell,
  Flex,
  SPACING,
  DIRECTION_ROW,
  Box,
  Text,
  JUSTIFY_CENTER,
  ALIGN_CENTER,
  JUSTIFY_FLEX_END,
  JUSTIFY_END,
  DeckConfigurator,
} from '@opentrons/components'
import {
  Cutout,
  DeckConfiguration,
  STAGING_AREA_LOAD_NAME,
  STANDARD_SLOT_LOAD_NAME,
} from '@opentrons/shared-data'
import { i18n } from '../../localization'
import {
  createDeckFixture,
  deleteDeckFixture,
} from '../../step-forms/actions/additionalItems'
import { getSlotIsEmpty } from '../../step-forms'
import { getInitialDeckSetup } from '../../step-forms/selectors'
import { PDAlert } from '../alerts/PDAlert'
import { AdditionalEquipmentEntity } from '@opentrons/step-generation'
import { getStagingAreaSlots } from '../../utils'

const STAGING_AREA_SLOTS: Cutout[] = ['A3', 'B3', 'C3', 'D3']

export interface StagingAreasValues {
  selectedSlots: string[]
}

const StagingAreasModalComponent = (
  props: StagingAreasModalProps
): JSX.Element => {
  const { onCloseClick, stagingAreas } = props
  const { values, setFieldValue } = useFormikContext<StagingAreasValues>()
  const initialDeckSetup = useSelector(getInitialDeckSetup)
  const areSlotsEmpty = values.selectedSlots.map(slot =>
    getSlotIsEmpty(initialDeckSetup, slot)
  )
  const hasConflictedSlot = areSlotsEmpty.includes(false)

  const mappedStagingAreas = stagingAreas.flatMap(area => {
    return [
      {
        fixtureId: area.id,
        fixtureLocation: area.location ?? '',
        loadName: STAGING_AREA_LOAD_NAME,
      },
    ] as DeckConfiguration
  })
  const STANDARD_EMPTY_SLOTS: DeckConfiguration = STAGING_AREA_SLOTS.map(
    fixtureLocation => ({
      fixtureId: `id_${fixtureLocation}`,
      fixtureLocation: fixtureLocation as Cutout,
      loadName: STANDARD_SLOT_LOAD_NAME,
    })
  )

  STANDARD_EMPTY_SLOTS.forEach(emptySlot => {
    if (
      !mappedStagingAreas.some(
        slot => slot.fixtureLocation === emptySlot.fixtureLocation
      )
    ) {
      mappedStagingAreas.push(emptySlot)
    }
  })

  const selectableSlots =
    mappedStagingAreas.length > 0 ? mappedStagingAreas : STANDARD_EMPTY_SLOTS
  const [updatedSlots, setUpdatedSlots] = React.useState<DeckConfiguration>(
    selectableSlots
  )

  const handleClickAdd = (fixtureLocation: string): void => {
    const modifiedSlots: DeckConfiguration = updatedSlots.map(slot => {
      if (slot.fixtureLocation === fixtureLocation) {
        return {
          ...slot,
          loadName: STAGING_AREA_LOAD_NAME,
        }
      }
      return slot
    })
    setUpdatedSlots(modifiedSlots)
    const updatedSelectedSlots = [...values.selectedSlots, fixtureLocation]
    setFieldValue('selectedSlots', updatedSelectedSlots)
  }

  const handleClickRemove = (fixtureLocation: string): void => {
    const modifiedSlots: DeckConfiguration = updatedSlots.map(slot => {
      if (slot.fixtureLocation === fixtureLocation) {
        return {
          ...slot,
          loadName: STANDARD_SLOT_LOAD_NAME,
        }
      }
      return slot
    })
    setUpdatedSlots(modifiedSlots)
    const updatedSelectedSlots = values.selectedSlots.filter(
      item => item !== fixtureLocation
    )
    setFieldValue('selectedSlots', updatedSelectedSlots)
  }

  return (
    <Form>
      <Box paddingX={SPACING.spacing32}>
        <Flex
          justifyContent={JUSTIFY_END}
          alignItems={ALIGN_CENTER}
          height="3.125rem"
        >
          <Box>
            {hasConflictedSlot ? (
              <PDAlert
                alertType="warning"
                title={i18n.t(
                  'alert.deck_config_placement.SLOT_OCCUPIED.staging_area'
                )}
                description={''}
              />
            ) : null}
          </Box>
        </Flex>

        <Flex
          height="20rem"
          marginTop="-2.5rem"
          justifyContent={JUSTIFY_CENTER}
        >
          <DeckConfigurator
            deckConfig={updatedSlots}
            handleClickAdd={handleClickAdd}
            handleClickRemove={handleClickRemove}
          />
        </Flex>
      </Box>
      <Flex
        flexDirection={DIRECTION_ROW}
        justifyContent={JUSTIFY_FLEX_END}
        paddingTop="4rem"
        paddingRight={SPACING.spacing32}
        paddingBottom={SPACING.spacing32}
        gridGap={SPACING.spacing8}
      >
        <OutlineButton onClick={onCloseClick}>
          {i18n.t('button.cancel')}
        </OutlineButton>
        <OutlineButton type={BUTTON_TYPE_SUBMIT} disabled={hasConflictedSlot}>
          {i18n.t('button.save')}
        </OutlineButton>
      </Flex>
    </Form>
  )
}

export interface StagingAreasModalProps {
  onCloseClick: () => void
  stagingAreas: AdditionalEquipmentEntity[]
}

export const StagingAreasModal = (
  props: StagingAreasModalProps
): JSX.Element => {
  const { onCloseClick, stagingAreas } = props
  const dispatch = useDispatch()
  const stagingAreaLocations = getStagingAreaSlots(stagingAreas)

  const onSaveClick = (values: StagingAreasValues): void => {
    onCloseClick()

    values.selectedSlots.forEach(slot => {
      if (!stagingAreaLocations?.includes(slot)) {
        dispatch(createDeckFixture('stagingArea', slot))
      }
    })
    Object.values(stagingAreas).forEach(area => {
      if (!values.selectedSlots.includes(area.location as string)) {
        dispatch(deleteDeckFixture(area.id))
      }
    })
  }

  return (
    <Formik
      onSubmit={onSaveClick}
      initialValues={{
        selectedSlots: stagingAreaLocations ?? [],
      }}
    >
      <ModalShell width="48rem">
        <Box marginTop={SPACING.spacing32} paddingX={SPACING.spacing32}>
          <Text as="h2">
            {i18n.t(`modules.additional_equipment_display_names.stagingAreas`)}
          </Text>
        </Box>
        <StagingAreasModalComponent
          onCloseClick={onCloseClick}
          stagingAreas={stagingAreas}
        />
      </ModalShell>
    </Formik>
  )
}
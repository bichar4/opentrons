import type { CommonCommandRunTimeInfo, CommonCommandCreateInfo } from '.'
export type PipettingRunTimeCommand =
  | AspirateRunTimeCommand
  | DispenseRunTimeCommand
  | BlowoutRunTimeCommand
  | BlowoutInPlaceRunTimeCommand
  | TouchTipRunTimeCommand
  | PickUpTipRunTimeCommand
  | DropTipRunTimeCommand
  | DropTipInPlaceRunTimeCommand
  | ConfigureForVolumeRunTimeCommand

export type PipettingCreateCommand =
  | AspirateCreateCommand
  | DispenseCreateCommand
  | BlowoutCreateCommand
  | BlowoutInPlaceCreateCommand
  | TouchTipCreateCommand
  | PickUpTipCreateCommand
  | DropTipCreateCommand
  | DropTipInPlaceCreateCommand
  | ConfigureForVolumeCreateCommand

export interface ConfigureForVolumeCreateCommand
  extends CommonCommandCreateInfo {
  commandType: 'configureForVolume'
  params: ConfigureForVolumeParams
}

export interface ConfigureForVolumeParams {
  pipetteId: string
  volume: number
}
export interface ConfigureForVolumeRunTimeCommand
  extends CommonCommandRunTimeInfo,
    ConfigureForVolumeCreateCommand {
  result?: BasicLiquidHandlingResult
}
export interface AspirateCreateCommand extends CommonCommandCreateInfo {
  commandType: 'aspirate'
  params: AspDispAirgapParams
}
export interface AspirateRunTimeCommand
  extends CommonCommandRunTimeInfo,
    AspirateCreateCommand {
  result?: BasicLiquidHandlingResult
}

export type DispenseParams = AspDispAirgapParams & { pushOut?: number }
export interface DispenseCreateCommand extends CommonCommandCreateInfo {
  commandType: 'dispense'
  params: DispenseParams
}
export interface DispenseRunTimeCommand
  extends CommonCommandRunTimeInfo,
    DispenseCreateCommand {
  result?: BasicLiquidHandlingResult
}
export interface BlowoutCreateCommand extends CommonCommandCreateInfo {
  commandType: 'blowout'
  params: BlowoutParams
}
export interface BlowoutRunTimeCommand
  extends CommonCommandRunTimeInfo,
    BlowoutCreateCommand {
  result?: BasicLiquidHandlingResult
}
export interface BlowoutInPlaceCreateCommand extends CommonCommandCreateInfo {
  commandType: 'blowOutInPlace'
  params: BlowoutInPlaceParams
}
export interface BlowoutInPlaceRunTimeCommand
  extends CommonCommandRunTimeInfo,
    BlowoutInPlaceCreateCommand {
  result?: BasicLiquidHandlingResult
}

export interface TouchTipCreateCommand extends CommonCommandCreateInfo {
  commandType: 'touchTip'
  params: TouchTipParams
}
export interface TouchTipRunTimeCommand
  extends CommonCommandRunTimeInfo,
    TouchTipCreateCommand {
  result?: BasicLiquidHandlingResult
}
export interface PickUpTipCreateCommand extends CommonCommandCreateInfo {
  commandType: 'pickUpTip'
  params: PickUpTipParams
}
export interface PickUpTipRunTimeCommand
  extends CommonCommandRunTimeInfo,
    PickUpTipCreateCommand {
  result?: any
}
export interface DropTipCreateCommand extends CommonCommandCreateInfo {
  commandType: 'dropTip'
  params: DropTipParams
}
export interface DropTipRunTimeCommand
  extends CommonCommandRunTimeInfo,
    DropTipCreateCommand {
  result?: any
}
export interface DropTipInPlaceCreateCommand extends CommonCommandCreateInfo {
  commandType: 'dropTipInPlace'
  params: DropTipInPlaceParams
}
export interface DropTipInPlaceRunTimeCommand
  extends CommonCommandRunTimeInfo,
    DropTipInPlaceCreateCommand {
  result?: any
}

export type AspDispAirgapParams = FlowRateParams &
  PipetteAccessParams &
  VolumeParams &
  WellLocationParam
export type BlowoutParams = FlowRateParams &
  PipetteAccessParams &
  WellLocationParam
export type TouchTipParams = PipetteAccessParams & WellLocationParam
export type DropTipParams = PipetteAccessParams & {
  wellLocation?: {
    origin?: 'default' | 'top' | 'center' | 'bottom'
    offset?: {
      // mm values all default to 0
      x?: number
      y?: number
      z?: number
    }
  }
}
export type PickUpTipParams = TouchTipParams
export interface DropTipInPlaceParams {
  pipetteId: string
}
export interface BlowoutInPlaceParams {
  pipetteId: string
  flowRate: number // µL/s
}

interface FlowRateParams {
  flowRate: number // µL/s
}

interface PipetteAccessParams {
  pipetteId: string
  labwareId: string
  wellName: string
}

interface VolumeParams {
  volume: number // µL
}

interface WellLocationParam {
  wellLocation?: {
    // default value is 'top'
    origin?: 'top' | 'center' | 'bottom'
    offset?: {
      // mm
      // all values default to 0
      x?: number
      y?: number
      z?: number
    }
  }
}

interface BasicLiquidHandlingResult {
  volume: number // Amount of liquid in uL handled in the operation
}

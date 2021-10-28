import type { PipettingCommand } from './pipetting'
import type { GantryCommand } from './gantry'
import type { ModuleCommand } from './module'
import type { SetupCommand } from './setup'
import type { TimingCommand } from './timing'

// NOTE: these key/value pairs will only be present on commands at analysis/run time
// they pertain only to the actual execution status of a command on hardware, as opposed to
// the command's identity and parameters which can be known prior to runtime
interface CommandRunTimeInfo {
  status?: 'queued' | 'running' | 'succeeded' | 'failed'
  error?: string
  createdAt?: string
  startedAt?: string
  completedAt?: string
}

// all commands must have an id
interface CommonCommandInfo extends CommandRunTimeInfo {
  id: string
}

export type Command = CommonCommandInfo &
  (
    | PipettingCommand // involves the pipettes plunger motor
    | GantryCommand // movement that only effects the x,y,z position of the gantry/pipette
    | ModuleCommand // directed at a hardware module
    | SetupCommand // only effecting robot's equipment setup (pipettes, labware, modules, liquid), no hardware side-effects
    | TimingCommand // effecting the timing of command execution
    | { commandType: 'custom'; params: { [key: string]: any } } // allows for experimentation between schema versions with no expectation of system support
  )
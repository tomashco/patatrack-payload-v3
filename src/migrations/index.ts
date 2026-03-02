import * as migration_20260302_221030_upgrade_to_payload_3_78 from './20260302_221030_upgrade_to_payload_3_78'

export const migrations = [
  {
    up: migration_20260302_221030_upgrade_to_payload_3_78.up,
    down: migration_20260302_221030_upgrade_to_payload_3_78.down,
    name: '20260302_221030_upgrade_to_payload_3_78',
  },
]

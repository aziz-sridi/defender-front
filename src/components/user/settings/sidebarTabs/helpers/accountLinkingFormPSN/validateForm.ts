import { toast } from 'sonner'

export default function validateForm(platform: string, data: any): boolean {
  const showError = (message: string) => {
    toast.error(message)
    return false
  }

  switch (platform) {
    case 'psn':
      if (!data.nickname || !data.confirmNickname) {
        return showError('Please fill in all fields')
      }
      if (data.nickname !== data.confirmNickname) {
        return showError('Nicknames do not match')
      }
      return true

    case 'xbox':
      if (!data.gamertag || !data.confirmGamertag) {
        return showError('Please fill in all fields')
      }
      if (data.gamertag !== data.confirmGamertag) {
        return showError('Gamertags do not match')
      }
      return true

    case 'battlenet':
      if (!data.battletag || !data.confirmBattletag) {
        return showError('Please fill in all fields')
      }
      if (data.battletag !== data.confirmBattletag) {
        return showError('BattleTags do not match')
      }
      return true

    case 'riot':
      if (!data.riotId || !data.tagline) {
        return showError('Please fill in all fields')
      }
      return true

    case 'discord':
      if (!data.discordUsername || !data.confirmDiscordUsername) {
        return showError('Please fill in all fields')
      }
      if (data.discordUsername !== data.confirmDiscordUsername) {
        return showError('Discord usernames do not match')
      }
      return true

    default:
      return true
  }
}

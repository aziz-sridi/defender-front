export const getInstructionText = (platform: string): string => {
  const messages: Record<string, string> = {
    psn: "Please make sure that your main PSN account is connected. You will not be able to change this account since it's linked.",
    xbox: "Please make sure that your main Xbox account is connected. You will not be able to change this account since it's linked.",
    battlenet:
      "Please make sure that your main Battle.net account is connected. You will not be able to change this account since it's linked.",
    riot: "Please make sure that your main Riot Games account is connected. You will not be able to change this account since it's linked.",
    discord:
      "Please make sure that your main Discord account is connected. You will not be able to change this account since it's linked.",
    default:
      "Please make sure that your main account is connected. You will not be able to change this account since it's linked.",
  }

  return messages[platform] || messages.default
}

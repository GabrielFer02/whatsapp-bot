export const verifyPrefix = (prefix: string) => prefix === '/'
export const hasTypeAndCommand = ({type, command}: {type: string, command: string}) => type && command
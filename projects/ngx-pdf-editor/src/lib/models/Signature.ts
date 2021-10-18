export interface SignatureElementProps {
    signers: Signer[]
}

export interface Signer {
    name: string,
    order: number,
    type: number
}
export interface IPaymentGateway {
    charge(amount: number): Promise<{ success: boolean; transactionId?: string }>;
}

export const IPaymentGateway = Symbol('IPaymentGateway');
import { IPaymentGateway } from "../../src/gateways/IPaymentGateway";

export const paymentGatewayMock = (): jest.Mocked<IPaymentGateway> => ({
    charge: jest.fn<Promise<{ success: boolean; transactionId?: string }>, [number]>(),
});

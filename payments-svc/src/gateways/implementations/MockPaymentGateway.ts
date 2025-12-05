import { IPaymentGateway } from "../IPaymentGateway";


export class MockPaymentGateway implements IPaymentGateway {
    async charge(amount: number) {
        // Simula um delay de processamento
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock: 50% sucesso, 50% falha
        const success = Math.random() > 0.5;

        return {
            success,
            transactionId: success ? `tx_${Date.now()}` : undefined,
        };
    }
}

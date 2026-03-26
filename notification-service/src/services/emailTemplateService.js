const PAYMENT_CONFIRMED_ROUTING_KEY = 'payment.confirmed';
const PAYMENT_FAILED_ROUTING_KEY = 'payment.failed';
const PAYMENT_CONFIRMED_STATUS = 'confirmed';
const PAYMENT_FAILED_STATUS = 'failed';

function buildConfirmedEmailPayload({ orderId, paymentMethod, status, processedAt }) {
  return {
    orderId,
    paymentMethod,
    status,
    processedAt,
    assunto: 'Pagamento confirmado',
    mensagem: `Seu pagamento foi realizado com sucesso para a ordem numero ${orderId} via ${paymentMethod}. Processado em ${processedAt}`
  };
}

function buildFailedEmailPayload({ orderId, paymentMethod, status, processedAt }) {
  return {
    orderId,
    paymentMethod,
    status,
    processedAt,
    assunto: 'Falha no pagamento',
    mensagem: `Infelizmente ocorreu uma falha ao processar o pagamento da ordem numero ${orderId} via ${paymentMethod}. Evento processado em ${processedAt}. Por favor tente novamente.`
  };
}

function buildEmailPayload(routingKey, payload) {
  const { orderId, paymentMethod, status, processedAt } = payload;

  if (!orderId || !paymentMethod || !status || !processedAt) {
    throw new Error(
      'Payload invalido: campos obrigatorios orderId, paymentMethod, status e processedAt.'
    );
  }

  if (routingKey === PAYMENT_CONFIRMED_ROUTING_KEY) {
    if (status !== PAYMENT_CONFIRMED_STATUS) {
      throw new Error(
        `Payload invalido: status ${status} incompatível com routing key ${routingKey}.`
      );
    }

    return buildConfirmedEmailPayload({ orderId, paymentMethod, status, processedAt });
  }

  if (routingKey === PAYMENT_FAILED_ROUTING_KEY) {
    if (status !== PAYMENT_FAILED_STATUS) {
      throw new Error(
        `Payload invalido: status ${status} incompatível com routing key ${routingKey}.`
      );
    }

    return buildFailedEmailPayload({ orderId, paymentMethod, status, processedAt });
  }

  throw new Error(`Routing key nao suportada: ${routingKey}`);
}

module.exports = {
  PAYMENT_CONFIRMED_ROUTING_KEY,
  PAYMENT_FAILED_ROUTING_KEY,
  buildEmailPayload
};

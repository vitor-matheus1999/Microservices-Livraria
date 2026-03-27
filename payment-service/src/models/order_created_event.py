from dataclasses import dataclass, field
from typing import List
from datetime import datetime


@dataclass
class OrderItem:
    productId: str
    productName: str
    quantity: int
    unitPrice: float

    @staticmethod
    def from_dict(data: dict) -> "OrderItem":
        return OrderItem(
            productId=data["productId"],
            productName=data["productName"],
            quantity=data["quantity"],
            unitPrice=data["unitPrice"],
        )


@dataclass
class OrderCreatedData:
    orderId: str
    customerName: str
    items: List[OrderItem]
    totalAmount: float
    status: str
    paymentToken: str

    @property
    def amount(self) -> float:
        return self.totalAmount

    @staticmethod
    def from_dict(data: dict) -> "OrderCreatedData":
        return OrderCreatedData(
            orderId=data["orderId"],
            customerName=data["customerName"],
            items=[OrderItem.from_dict(i) for i in data.get("items", [])],
            totalAmount=data["totalAmount"],
            status=data["status"],
            paymentToken=data["paymentToken"],
        )


@dataclass
class OrderCreatedEvent:
    eventType: str
    source: str
    occurredAt: str
    data: OrderCreatedData

    @staticmethod
    def from_dict(raw: dict) -> "OrderCreatedEvent":
        return OrderCreatedEvent(
            eventType=raw["eventType"],
            source=raw["source"],
            occurredAt=raw["occurredAt"],
            data=OrderCreatedData.from_dict(raw["data"]),
        )

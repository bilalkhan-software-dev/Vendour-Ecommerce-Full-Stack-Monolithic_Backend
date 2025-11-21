import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { CheckCircleRounded, FiberManualRecordRounded } from "@mui/icons-material";
import dayjs from "dayjs";

interface OrderStepperProp {
    orderStatus: string;
    orderDate: string;
}
interface StepStatusProps {
    name: string;
    description: string;
    value: string;
}

const OrderStepper = ({ orderStatus, orderDate }: OrderStepperProp) => {
    const [statusStep, setStatusStep] = useState<StepStatusProps[]>([]);

    const formatDate = (dateString: string) => {
        return dayjs(dateString).format("ddd, DD MMM");
        // Example → Mon, 22 Sep
    };

    const addDays = (dateString: string, days: number) => {
        return dayjs(dateString).add(days, "day").format("ddd, DD MMM");
    };

    useEffect(() => {
        if (orderStatus === "CANCELLED") {
            setStatusStep([
                {
                    name: "Order Placed",
                    description: `on ${formatDate(orderDate)}`,
                    value: "PLACED",
                },
                {
                    name: "Order Cancelled",
                    description: `on ${formatDate(dayjs().toISOString())}`, // assume cancelled today
                    value: "CANCELLED",
                },
            ]);
        } else {
            setStatusStep([
                {
                    name: "Order Placed",
                    description: `on ${formatDate(orderDate)}`,
                    value: "PLACED",
                },
                {
                    name: "Confirmed",
                    description: "Order confirmed by seller",
                    value: "CONFIRMED",
                },
                {
                    name: "Packed",
                    description: "Items packed in warehouse",
                    value: "PACKED",
                },
                {
                    name: "Shipped",
                    description: `by ${addDays(orderDate, 2)}`,
                    value: "SHIPPED",
                },
                {
                    name: "Out for Delivery",
                    description: `by ${addDays(orderDate, 3)}`,
                    value: "OUT_FOR_DELIVERY",
                },
                {
                    name: "Delivered",
                    description: `by ${addDays(orderDate, 7)}`,
                    value: "DELIVERED",
                },
            ]);
        }
    }, [orderStatus, orderDate]);

    // figure out which step index is current
    const currentStep = statusStep.findIndex((s) => s.value === orderStatus);

    return (
        <Box className="mx-auto my-10">
            {statusStep.map((step, index) => (
                <div key={index} className="flex px-4">
                    <div className="flex flex-col items-center">
                        <Box
                            sx={{ zIndex: -1 }}
                            className={`w-8 h-8 rounded-full flex items-center justify-center z-10
                ${index <= currentStep ? "bg-gray-200 text-primary-color" : "bg-gray-300 text-gray-700"}
              `}
                        >
                            {step.value === orderStatus ?
                                <div className="animate-pulse">
                                    <CheckCircleRounded />
                                </div> :
                                <FiberManualRecordRounded />
                            }
                        </Box>

                        {/* connector line */}
                        {statusStep.length - 1 !== index && (
                            <div
                                className={`light-thin-border h-20 w-[2px] ${index < currentStep ? "bg-primary-color" : "bg-gray-200 text-gray-700"
                                    }`}
                            ></div>
                        )}
                    </div>

                    {/* Step label */}
                    <div className="ml-2 w-full">
                        <div
                            className={`${step.value === orderStatus
                                ? "bg-primary-color p-2 text-white font-medium rounded-md -translate-y-3"
                                : ""}
                ${orderStatus === "CANCELLED" && step.value === "CANCELLED" ? "bg-red-600" : ""}
                w-full`}
                        >
                            <p>{step.name}</p>
                            <p
                                className={`text-xs ${step.value === orderStatus ? "text-gray-200" : "text-gray-500"
                                    }`}
                            >
                                {step.description}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </Box>
    );
};

export default OrderStepper;

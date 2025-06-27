import { Box, IconButton, Typography } from "@mui/material"
import { DynamicAutocomplete } from "../DynamicMultipleSelect";
import { Delete } from "@mui/icons-material";
import { useState } from "react";
import { User } from "../../../api/user_api";
import { PercentageInputField } from "../InputTextField";

export interface EmployeePaymentInfo {
    employeeEmail: string;
    employeeName: string;
    paymentPercentage?: number;
    paymentType: "porcentaje" | "salario" | "mixto";
}

export interface EmployeePaymentsProps {
    allEmployees?: string[];
    employeePayments?: EmployeePaymentInfo[];
    totalPayment?: number;
    onChangePercentage?: (employeeEmail: string, newPercentage: number) => void;
    onAdd?: (employeeName: string) => void;
    onDelete?: (employeeName: string) => void;
    error?: string;
    selectedValue?: string;
    setSelectedValue?: (value: string) => void;
}

export const EmployeePayments = (props: EmployeePaymentsProps) => {
    return (
        <Box gap={2} display='flex' flexDirection='column'>
            <DynamicAutocomplete labelText="Empleados" values={props.allEmployees} selectedValue={props.selectedValue} onSelect={props.setSelectedValue} onAdd={props.onAdd} error={props.error}
                selectedValues={props.employeePayments?.map((e => e.employeeName))} />
            {props.employeePayments && props.employeePayments.length > 0 &&
                <EmployeeInfo {...props} onDelete={(e) => { props.onDelete?.(e); props.setSelectedValue?.('') }} />
            }
        </Box>
    )
}

const EmployeeInfo = (props: EmployeePaymentsProps) => {
    const calcPayment = (percentage: number) => {
        return Math.round((isNaN(percentage) ? 0 : percentage)* (props.totalPayment ?? 0)) / 100;
    }


    return (
        <Box>
            <Box display='flex' flexDirection='row'>
                <Typography variant="body2" sx={{ flex: "1 50%", color: 'black', fontWeight: 'bold', marginLeft: 5 }}>
                    Empleados
                </Typography>
                <Typography variant="body2" sx={{ flex: "1 40%", color: 'black', fontWeight: 'bold' }}>
                    Pagos
                </Typography>
                <Box sx={{ flex: "1 10%" }} />
            </Box>
            <Box display={'flex'} flexDirection='column' gap={2} p={2} alignContent={'center'} justifyContent={'center'} bgcolor={"#e0e0e0"} borderRadius={5}>
                {props.employeePayments?.map((payment, index) => (
                    <Box display='flex' flexDirection='row' key={index}>
                        <Typography variant="body2" sx={{ flex: "1 50%", color: 'black', marginLeft: 5 }}>
                            {payment.employeeName}
                        </Typography>
                        {payment.paymentType === "salario" ? <Typography variant="body2" sx={{ flex: "1 40%", color: 'black' }}>Salario</Typography> :
                            <Box display='flex' flexDirection='row' alignItems={'center'} marginTop={-2}>
                                <PercentageInputField width="30%" value={(payment.paymentPercentage??0).toFixed(0)} onValueChange={(value) => props.onChangePercentage?.(payment.employeeEmail, parseFloat(value))}/>
                                <Typography variant="body2" sx={{ flex: "1 40%", color: 'black' }}>
                                    {`% $${calcPayment(payment.paymentPercentage??0).toFixed(2)}`}
                                </Typography>
                            </Box>
                        }

                        <IconButton sx={{ flex: "1 10%", }}>
                            <Delete
                                key={index}
                                sx={{ color: '#DC3545' }}
                                onClick={() => props.onDelete?.(payment.employeeEmail ?? '')} />
                        </IconButton>
                    </Box>
                ))}

            </Box>
        </Box>
    )
}

export const useEmployeePayments = () => {
    const [selectedValue, setSelectedValue] = useState<string>('');
    const [allEmployees, setAllEmployees] = useState<User[]>([]);
    const [employeePayments, setEmployeePayments] = useState<EmployeePaymentInfo[]>([]);
    const [totalPayment, setTotalPayment] = useState<number>(0);
    const [error, setError] = useState<string>("");

    const isAllSamePercentage = (): boolean => {
        if (employeePayments.length === 0) return true;
        const firstPercentage = employeePayments[0].paymentPercentage;
        return employeePayments.every(payment => payment.paymentPercentage === firstPercentage);
    }

    const addEmployeePayment = (employeeEmail: string) => {
        const employee = allEmployees.find(e => e.email === employeeEmail);
        const nonSalaryEmployees = employeePayments.filter(payment => payment.paymentType !== "salario");
        const percentage = 100 / (nonSalaryEmployees.length + (employee?.paymentType !== "salario" ? 1 : 0));
        const updatedPayments = employeePayments.map(payment => ({
            ...payment,
            paymentPercentage: payment.paymentType !== "salario" ? parseFloat(percentage.toFixed(0)) : 0
        }));
        if (employee) {
            setEmployeePayments([...updatedPayments, { employeeEmail: employee.email, employeeName: employee.name, paymentPercentage: employee.paymentType !== "salario" ? parseFloat(percentage.toFixed(0)) : 0, paymentType: employee.paymentType ?? "porcentaje" }]);
        }
    }

    const deleteEmployeePayment = (employeeEmail: string) => {
        console.log("Deleting employee payment for:", employeeEmail);
        const updatedPayments = employeePayments.filter(payment => payment.employeeEmail !== employeeEmail);
        const nonSalaryEmployees = updatedPayments.filter(payment => payment.paymentType !== "salario");
        const percentage = (100 / nonSalaryEmployees.length);
        const newPayments = updatedPayments.map(payment => ({
            ...payment,
            paymentPercentage: payment.paymentType !== "salario" ? parseFloat(percentage.toFixed(0)) : 0
        }));
        setEmployeePayments(newPayments);
    }

    const updatePercentage = (employeeEmail: string, newPercentage: number) => {
        const updatedPayments = employeePayments.map(payment => {
            if (payment.employeeEmail === employeeEmail) {
                return { ...payment, paymentPercentage: newPercentage };
            }
            return payment;
        });
        setEmployeePayments(updatedPayments);
    }

    const getProps = (): EmployeePaymentsProps => {
        return {
            allEmployees: allEmployees.map(e => e.name),
            employeePayments,
            totalPayment,
            onAdd: addEmployeePayment,
            onDelete: deleteEmployeePayment,
            onChangePercentage: updatePercentage,
            error,
            selectedValue,
            setSelectedValue,
        };
    }

    const clearInputs = () => {
        setEmployeePayments([]);
        setTotalPayment(0);
        setSelectedValue('');
    }

    const clearError = () => {
        setError("");
    }

    return {
        allEmployees,
        setAllEmployees,
        employeePayments,
        setEmployeePayments,
        totalPayment,
        setTotalPayment,
        error,
        setError,
        isAllSamePercentage,
        getProps,
        clearInputs,
        clearError,
        addEmployeePayment,
        setSelectedValue,
        deleteEmployeePayment
    }
}
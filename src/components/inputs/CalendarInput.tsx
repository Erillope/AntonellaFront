import { useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import "../../styles/calendar.css"
import { Box, FormHelperText, IconButton } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import dayjs from 'dayjs';

export interface DateValue {
    start: Date;
    end: Date;
    color?: string;
}

export interface CalendarInputProps {
    values?: DateValue[];
    onSelect?: (start: Date, end: Date) => void;
    onRemove?: (start: Date, end: Date) => void;
    selectable?: boolean;
    error?: string;
    height?: string;
}

export function Calendar(props: CalendarInputProps) {
    const calendarRef = useRef<any>(null);
    const [currentDate, setCurrentDate] = useState(new Date());

    return (
        <Box minHeight={props.height??'80%'} width={'100%'} display='flex' flexDirection='column'>
            <CalendarHeader
                currentDate={currentDate}
                calendarRef={calendarRef}
                setCurrentDate={setCurrentDate}
            />

            <FullCalendar
                ref={calendarRef}
                plugins={[timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                headerToolbar={false}
                allDaySlot={false}
                select={props.onSelect === undefined ? () => {} : (arg) =>  props.onSelect?.(arg.start, arg.end)}
                events={props.values?.map((v) => {
                    return {
                        title: "",
                        start: v.start,
                        end: v.end,
                        color: v.color ?? '#F87171',
                    };
                })}
                selectable={props.selectable}
                selectMirror={true}
                datesSet={(arg) => setCurrentDate(arg.start)}
                slotLabelFormat={{
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: false,
                }}
                locale="es"
                slotDuration="00:10:00"
                height={'100%'}
                eventClick={(info) => props.onRemove?.(info.event.start as Date, info.event.end as Date)}
            />
            {!!props.error && props.error.length > 0 &&
                <FormHelperText className="helperText">{props.error}</FormHelperText>
            }
        </Box>
    );
}

interface CalendarHeaderProps {
    currentDate: Date;
    calendarRef: React.RefObject<any>;
    setCurrentDate: (date: Date) => void;
}

const CalendarHeader = (props: CalendarHeaderProps) => {

    const handlePrev = () => {
        const calendarApi = props.calendarRef.current.getApi();
        calendarApi.prev();
        props.setCurrentDate(calendarApi.getDate());
    };

    const handleNext = () => {
        const calendarApi = props.calendarRef.current.getApi();
        calendarApi.next();
        props.setCurrentDate(calendarApi.getDate());
    };

    return (
        <Box width={'100%'} display='flex' justifyContent='center' alignItems='center'>
            <IconButton onClick={handlePrev}><KeyboardArrowLeft /></IconButton>
            <span style={{ fontWeight: 'bold' }}>{props.currentDate.toLocaleDateString()}</span>
            <IconButton onClick={handleNext}><KeyboardArrowRight /></IconButton>
        </Box>
    )
}

interface useCalendarProps {
    overlappingHandler?: (start: Date, end: Date) => void;
}

export const useCalendar = (props?: useCalendarProps) => {
    const [values, setValues] = useState<DateValue[]>([]);
    const [error, setError] = useState<string>("");

    const addValue = (start: Date, end: Date, color?: string) => {
        if (isOverlapping(start, end)) {
            props?.overlappingHandler?.(start, end)
            return;
        }
        const newValue: DateValue = {
            start,
            end,
            color: color ?? '#F87171',
        };
        setValues((prev) => [...prev, newValue]);
    }

    const isOverlapping = (start: Date, end: Date): boolean => {
        return values.some((value) => {
            return (
                dayjs(start).isBefore(value.end) &&
                dayjs(end).isAfter(value.start)
            );
        });
    }

    const removeValue = (start: Date, end: Date) => {
        setValues((prev) => prev.filter((p) => !dayjs(start).isBefore(p.end) ||
                                !dayjs(end).isAfter(p.start)));
    }

    const isEmpty = () => values.length === 0;

    const clearInput = () => setValues([]);

    const clearError = () => setError("");

    return {
        values,
        setValues,
        addValue,
        isOverlapping,
        removeValue,
        isEmpty,
        clearInput,
        error,
        setError,
        clearError,
    }
}
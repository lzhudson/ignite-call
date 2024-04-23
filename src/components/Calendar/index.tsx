import { CaretLeft, CaretRight, X } from 'phosphor-react'
import {
  CalendarActions,
  CalendarBody,
  CalendarContainer,
  CalendarDay,
  CalendarHeader,
  CalendarTitle,
  ToastRoot,
  ToastTitle,
  ToastViewport,
  ToastAction,
  TooltipArrow,
  TooltipContent,
  ToastDescription,
} from './styles'
import { getWeekDays } from '@/utils/get-week-days'
import { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { useRouter } from 'next/router'
import Tooltip from '../Tooltip'
import Toast from '../Toast'
import { Text } from '@ignite-ui/react'

interface CalendarWeek {
  week: number
  days: Array<{
    date: dayjs.Dayjs
    disabled: boolean
  }>
}

type CalendarWeeks = CalendarWeek[]

interface BlockedDates {
  blockedWeekDays: number[]
  blockedDates: number[]
}

interface CalendarProps {
  selectedDate?: Date | null
  onDateSelected: (date: Date) => void
}

export function Calendar({ onDateSelected }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => {
    return dayjs().set('date', 1)
  })

  const [open, setOpen] = useState(false)

  const router = useRouter()

  const schedulingDate = router.query.schedulingDate
    ? String(router.query.schedulingDate)
    : null

  const describedDate = dayjs(schedulingDate).format('DD[ de ]MMMM[ de ]YYYY')
  const describedTime = dayjs(schedulingDate).format('HH[:]mm[h]')

  useEffect(() => {
    if (schedulingDate) {
      setOpen(true)
    }
  }, [schedulingDate, router])

  function onUpdateUrlAfterCloseToast() {
    const currentPath = router.asPath
    const pathWithoutQueryParams = currentPath.substring(
      0,
      currentPath.indexOf('?'),
    )
    router.push(pathWithoutQueryParams, undefined, { shallow: true })
  }

  function handlePreviousMonth() {
    const previousMonthDate = currentDate.subtract(1, 'month')
    setCurrentDate(previousMonthDate)
  }

  function handleNextMonth() {
    const nextMonthDate = currentDate.add(1, 'month')
    setCurrentDate(nextMonthDate)
  }

  const shortWeekDays = getWeekDays({ short: true })

  const currentMonth = currentDate.format('MMMM')
  const currentYear = currentDate.format('YYYY')

  const username = String(router.query.username)

  const { data: blockedDates } = useQuery<BlockedDates>({
    queryKey: [
      'blocked-dates',
      currentDate.get('year'),
      currentDate.get('month'),
    ],
    queryFn: async () => {
      const response = await api.get(`/users/${username}/blocked-dates`, {
        params: {
          year: currentDate.get('year'),
          month: currentDate.format('MM'),
        },
      })
      return response.data
    },
  })

  const calendarWeeks = useMemo(() => {
    if (!blockedDates) {
      return []
    }

    const daysInMonthArray = Array.from({
      length: currentDate.daysInMonth(),
    }).map((_, i) => {
      return currentDate.set('date', i + 1)
    })

    const firstWeekDay = currentDate.get('day')

    const previousMonthFillArray = Array.from({
      length: firstWeekDay,
    })
      .map((_, i) => {
        return currentDate.subtract(i + 1, 'day')
      })
      .reverse()

    const lastDayInCurrentMonth = currentDate.set(
      'date',
      currentDate.daysInMonth(),
    )

    const lastWeekDay = lastDayInCurrentMonth.get('day')

    const nextMonthFillArray = Array.from({
      length: 7 - (lastWeekDay + 1),
    }).map((_, i) => {
      return lastDayInCurrentMonth.add(i + 1, 'day')
    })

    const calendarDays = [
      ...previousMonthFillArray.map((date) => {
        return { date, disabled: true }
      }),
      ...daysInMonthArray.map((date) => {
        return {
          date,
          disabled:
            date.endOf('day').isBefore(new Date()) ||
            blockedDates.blockedWeekDays.includes(date.get('day')) ||
            blockedDates.blockedDates.includes(date.get('date')),
        }
      }),
      ...nextMonthFillArray.map((date) => {
        return { date, disabled: true }
      }),
    ]

    const calendarWeeks = calendarDays.reduce<CalendarWeeks>(
      (weeks, _, i, original) => {
        const isNewWeek = i % 7 === 0

        if (isNewWeek) {
          weeks.push({
            week: i / 7 + 1,
            days: original.slice(i, i + 7),
          })
        }
        return weeks
      },
      [],
    )

    return calendarWeeks
  }, [currentDate, blockedDates])

  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarTitle>
          {currentMonth} <span>{currentYear}</span>
        </CalendarTitle>
        <CalendarActions>
          <button onClick={handlePreviousMonth} title="Next month">
            <CaretLeft />
          </button>
          <button onClick={handleNextMonth} title="Previous month">
            <CaretRight />
          </button>
        </CalendarActions>
      </CalendarHeader>
      <CalendarBody>
        <thead>
          <tr>
            {shortWeekDays.map((weekDay) => (
              <th key={weekDay}>{weekDay}.</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calendarWeeks.map(({ week, days }) => {
            return (
              <tr key={week}>
                {days.map(({ date, disabled }) => {
                  return (
                    <td key={date.toString()}>
                      <Tooltip.Provider>
                        <Tooltip.Root>
                          <Tooltip.Trigger asChild>
                            <CalendarDay
                              onClick={() => onDateSelected(date.toDate())}
                              disabled={disabled}
                            >
                              {date.get('date')}
                            </CalendarDay>
                          </Tooltip.Trigger>
                          <Tooltip.Portal>
                            <TooltipContent>
                              {dayjs(date).format('DD[ de ]MMMM')}
                              {disabled ? ' - Indisponível' : ' - Disponível'}
                              <TooltipArrow />
                            </TooltipContent>
                          </Tooltip.Portal>
                        </Tooltip.Root>
                      </Tooltip.Provider>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </CalendarBody>
      <Toast.Provider swipeDirection="right">
        <ToastRoot
          open={open}
          onOpenChange={(value) => {
            setOpen(value)
            onUpdateUrlAfterCloseToast()
          }}
        >
          <ToastTitle asChild>
            <Text size="xl">Agendamento realizado</Text>
          </ToastTitle>
          <ToastDescription asChild>
            <Text size="sm">
              {describedDate} ás {describedTime}
            </Text>
          </ToastDescription>
          <ToastAction asChild altText="Close toast">
            <button title="Close toast">
              <X />
            </button>
          </ToastAction>
        </ToastRoot>
        <ToastViewport />
      </Toast.Provider>
    </CalendarContainer>
  )
}

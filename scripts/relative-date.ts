import { format, isToday, isYesterday, differenceInDays, differenceInMinutes } from 'date-fns';

export function formatRelativeDate(date: string): string {
  const parsedDate = new Date(date);
  const now = new Date();

  // Calcula a diferença em minutos
  const minutesDiff = differenceInMinutes(now, parsedDate);

  if (minutesDiff < 60) {

    if(minutesDiff === 0) {
      return `Agora`
    }

    if(minutesDiff === 1) {
      return `Há 1 minuto`
    }
    
    return `Há ${minutesDiff} minutos`;
  }

  if (isToday(parsedDate)) {
    return `Hoje às ${format(parsedDate, 'HH:mm')}`;
  }

  if (isYesterday(parsedDate)) {
    return `Ontem às ${format(parsedDate, 'HH:mm')}`;
  }

  const daysDiff = differenceInDays(now, parsedDate);

  if (daysDiff <= 30) {
    return `Há ${daysDiff} dia(s) atrás`;
  }

  return format(parsedDate, 'dd/MM/yyyy');
}

import { format, isToday, isYesterday, differenceInDays } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export function formatRelativeDate(date: string): string {
  const timeZone = 'America/Sao_Paulo'; // Substitua pelo fuso horário desejado
  const parsedDate = toZonedTime(new Date(date), timeZone); // Converte UTC para o fuso desejado
  const now = toZonedTime(new Date(), timeZone); // Também ajusta o "agora" para o mesmo fuso

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

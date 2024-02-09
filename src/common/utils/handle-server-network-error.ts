import { Dispatch } from "redux";
import axios, { AxiosError } from "axios";
import { appActions } from "app/app.reducer";
/**
 * Обработчик ошибок сетевых запросов к серверу.
 * @param {unknown} e - Ошибка или ответ сетевого запроса.
 * @param {Dispatch} dispatch - Функция диспетчера Redux для обновления состояния приложения.
 * @return void
 */
export const handleServerNetworkError = (e: unknown, dispatch: Dispatch):void => {
  const err = e as Error | AxiosError<{ error: string }>;
  if (axios.isAxiosError(err)) {
    const error = err.message ? err.message : "Some error occurred";
    dispatch(appActions.setAppError({ error }));
  } else {
    dispatch(appActions.setAppError({ error: `Native error ${err.message}` }));
  }
  dispatch(appActions.setAppStatus({ status: "failed" }));
};

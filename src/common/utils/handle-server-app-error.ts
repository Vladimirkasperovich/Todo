import { Dispatch } from "redux";
import { appActions } from "app/app.reducer";
import { BaseResponseType } from "common/types/common.types";

/**
 * Данная функция обрабатывает ошибки, которые могут возникнуть при взаимодействии с сервером.
 * @param data  - ответ от сервера в формате ResponseType<D>
 * @param dispatch - функция для отправки сообщений в store Redux
 * @param showError - флаг, указывающий, нужно ли отображать ошибки в пользовательском интерфейсе
 * *@returns void
 */
export const handleServerAppError = <D>(data: BaseResponseType<D>, dispatch: Dispatch, showError:boolean = true) => {
  if (showError) {
    dispatch(appActions.setAppError({error: data.messages.length ? data.messages[0] : 'Some error occurred'}))
  }
  dispatch(appActions.setAppStatus({status: 'failed'}))
}

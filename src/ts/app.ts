import {
  catchError,
  EMPTY,
  interval,
  map,
  mergeAll,
  switchMap,
  throwError,
} from "rxjs";
import { ajax, AjaxError } from "rxjs/ajax";

import { Message, MessageInterface } from "./Message";

const vault: Message[] = [];
const list: HTMLUListElement | null = document.querySelector("ul");

interface ServerResponse {
  status: "ok";
  timestamp: number;
  messages: MessageInterface[];
}

function app() {
  const fetchUnreadMessages$ = interval(3000).pipe(
    switchMap(() =>
      ajax
        .getJSON<ServerResponse>(
          "https://ahj-rxjs-pooling-server-liaksej.vercel.app/messages/unread",
        )
        .pipe(
          catchError((err: AjaxError) => {
            if (err.status !== 200) {
              console.log("Error", err);
              return EMPTY;
            } else {
              return throwError(() => err.name);
            }
          }),
          map((response) => {
            return response.messages;
          }),
          mergeAll(),
        ),
    ),
  );

  fetchUnreadMessages$.subscribe((data: MessageInterface) => {
    const { id, from, subject, body, received } = data;
    const newMessage = new Message(id, from, subject, body, received);

    vault.push(newMessage);
    if (list) {
      newMessage.postMessage(list);
    }
  });
}

app();

import {
  catchError,
  interval,
  EMPTY,
  map,
  switchMap,
  throwError,
  from,
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
      ajax(
        "https://ahj-rxjs-pooling-server-liaksej.vercel.app/messages/unread",
      ).pipe(
        catchError((err: AjaxError) => {
          if (err.status === 404 || err.status === 500) {
            console.log("Error", err);
            return EMPTY;
          } else {
            return throwError(() => err.status);
          }
        }),
        map((response) => {
          const res = response.response as ServerResponse;
          return res.messages;
        }),
        switchMap((messages) => {
          return from(messages);
        }),
      ),
    ),
  );

  fetchUnreadMessages$.subscribe((data) => {
    const { id, from, subject, body, received }: MessageInterface = data;
    const newMessage = new Message(id, from, subject, body, received);

    vault.push(newMessage);
    if (list) {
      newMessage.postMessage(list);
    }
  });
}

app();

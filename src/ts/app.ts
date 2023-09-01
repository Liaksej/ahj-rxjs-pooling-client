import {
  catchError,
  interval,
  EMPTY,
  map,
  switchMap,
  throwError,
  from,
} from "rxjs";
import { ajax } from "rxjs/ajax";

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
          map((response) => {
            return response.messages;
          }),
          catchError((err) => {
            if (err.status === 404 || err.status === 500) {
              console.log("Error", err);
              return EMPTY;
            } else {
              return throwError(() => new Error(err));
            }
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

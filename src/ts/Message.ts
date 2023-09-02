export interface MessageInterface {
  id: string;
  from: string;
  subject: string;
  body: string;
  received: number;
}

export class Message implements MessageInterface {
  constructor(
    public id: string,
    public from: string,
    public subject: string,
    public body: string,
    public received: number,
  ) {
    this.id = id;
    this.from = from;
    this.subject = subject;
    this.body = body;
    this.received = received;
  }

  protected dateConverter(created: number) {
    const date = new Date(created);

    const formatter = new Intl.DateTimeFormat("ru", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    const formattedDateParts = formatter.formatToParts(date);
    return (
      formattedDateParts[6].value +
      ":" +
      formattedDateParts[8].value +
      " " +
      formattedDateParts[0].value +
      "." +
      formattedDateParts[2].value +
      "." +
      formattedDateParts[4].value
    );
  }

  public postMessage(list: HTMLUListElement) {
    const messageDomElement = document.createElement("li");

    messageDomElement.classList.add(
      "flex",
      "justify-between",
      "gap-x-6",
      "py-5",
    );
    messageDomElement.innerHTML = `
        <div class="min-w-0 w-5/12 flex-auto whitespace-nowrap overflow-ellipsis overflow-hidden">
          <p class="items-center text-sm leading-6 text-gray-900">${
            this.from
          }</p>
        </div>
        <div class="min-w-0 w-2/12 flex-auto whitespace-nowrap overflow-ellipsis overflow-hidden">
          <p class="justify-self-center text-sm leading-6 text-gray-900">${this.getSubject()}</p>
        </div>
        <div class="min-w-0 w-4/12 flex-auto whitespace-nowrap overflow-ellipsis overflow-hidden">
        <p class="text-right text-sm leading-6 text-gray-900">${this.dateConverter(
          this.received,
        )}</p>
      </div>`;

    list.prepend(messageDomElement);
  }

  private getSubject() {
    if (this.subject.length > 15) {
      return this.subject.substring(0, 15) + "...";
    }
    return this.subject;
  }
}

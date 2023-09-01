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
      <div class="flex min-w-0 gap-x-4">
        <div class="min-w-0 flex-auto">
          <p class="text-sm font-semibold leading-6 text-gray-900">${
            this.from
          }</p>
        </div>
        <div class="min-w-0 flex-auto">
          <p class="text-sm font-semibold leading-6 text-gray-900">${
            this.subject
          }</p>
        </div>
      </div>
      <div class="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
        <p class="text-sm leading-6 text-gray-900">${this.dateConverter(
          this.received,
        )}</p>
      </div>`;

    list.prepend(messageDomElement);
  }
}

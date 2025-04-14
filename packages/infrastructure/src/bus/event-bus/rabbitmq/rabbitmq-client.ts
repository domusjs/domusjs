import amqp, { Connection, Channel } from 'amqplib';

export class RabbitMQClient {
    
  private connection?: Connection;
  private channel?: Channel;

  constructor(private readonly url: string = 'amqp://localhost') {}

  async connect(): Promise<Channel> {
    if (this.channel) return this.channel;

    this.connection = await amqp.connect(this.url);
    this.channel = await this.connection.createChannel();
    return this.channel;
  }

  async close() {
    await this.channel?.close();
    await this.connection?.close();
  }
}

import { Injectable } from '@angular/core';
import { Subject, Subscription, Observer } from 'rxjs';
import { Message } from './message';

@Injectable({
  providedIn: 'root'
})
/**
 * Servicio que a partir de un conjunto de objetos de tipo Subject asociado a una clave o nombre de tópico, permite
 * publicar y escuchar mensajes.
 */
export class TopicService {

  // Esta es la lista de tópicos.
  private topics: Map<string, Subject<any>> = new Map<string, Subject<any>>();


  constructor() {}

 /**
  * Crea un nuevo tópico en el que publicar los mensajes a partir del topicName.
  * @param topicName Nombre del tópico que se va a crear.
  */
  public createTopic(topicName: string): void {

    // comprobamos que no existe previamente.
    if (!this.topics.get(topicName)) {
      this.newTopic(topicName);
    }
  }

  /**
   * Borramos el tópico identificado por el topicName
   * @param topicName nombre de tópico que se va a borrar.
   */
  public deleteTopic(topicName: string): void {
        // Get the subject for the topic name
        const subject: Subject<any> =  this.topics.get(topicName);
        // remove all subscribers
        subject.complete();
        this.topics.delete(topicName);
  }

  /**
   * Este método permite suscribirse al tópico y registrar una función de callback
   * @param topicName nombre de tópico en el que se va a suscribir
   * @param callback Una función que se va a ejecutar cuando se reciba el mensaje.
   */
  public subscribe(topicName: string, callback: (msg: any) => void): Subscription {

        let subject: Subject<any> = this.topics.get(topicName);

        if (!subject) {
          subject = this.newTopic(topicName);
          this.topics.set(topicName, subject);
        }

        return subject.subscribe((message: Message) => {
             callback(message);
        });

  }

  /**
   * Elimina a un suscriptor a partir de su suscripción.
   * @param subscription  objecto de tipo Subscription
   */
  public unsubscribe(subscription: Subscription): void {
    if (subscription) {
      subscription.unsubscribe();
    }
  }

  /**
   * Publica en un tópico.
   * @param topicName Nombre de tópico en el que se publica.
   * @param payload el mensaje que se publica.
   */
  public publish(topicName: string, message: Message): void {
    const subject: Subject<any> = this.topics.get(topicName);

    if (subject) {
      subject.next(message);
    }
  }
  /**
   * Elimina todos los topicos eliminando las suscriciones.
   */
  public clearAll(): void {
      this.topics.forEach((subject: Subject<any>, topicName: string) => {

        console.log('TopicService> eliminando topico :' + topicName);
        this.deleteTopic(topicName);

      });
  }

  /**
   * Crea el nuevo topico y el Subject asociado.
   * @param topicName  Nombre de tópico que se va a crear.
   */
  private newTopic(topicName: string): Subject<any> {
    const subject: Subject<any> = new Subject<any>();
    this.topics.set(topicName, subject);
    return subject;
  }
}

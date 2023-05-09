import { MessagePlugin } from '../plugins/interfaces/messagePlugin.js';
import { MessageEnv } from './types.js';

export interface MessageHandlerParams {
  plugins?: MessagePlugin[];
  state?: MessageEnv;
}

export abstract class MessageHandler {
  /**
   * The plugins array is used to run plugins before and after the message handler.
   * They are passed in when the handler is initialised.
   */
  plugins: MessagePlugin[];
  /**
   * The state object is used to pass data between plugins.
   */
  state: MessageEnv;

  constructor({ plugins, state }: MessageHandlerParams = {}) {
    this.plugins = plugins || [];
    this.state = state || {};
  }

  /**
   * The method that handles the message event. 
   * 
   * Takes in the MessageEvent as a mandatory argument as well as an optional 
   * object that can be used to pass further information/data. 
   */
  async handle(event: ExtendableMessageEvent, state: Record<string, any> = {}) {
    await this._handleMessage(event, state);
  }

  protected abstract _handleMessage(
    event: ExtendableMessageEvent,
    state: Record<string, any>
  ): Promise<void> | void;

  async runPlugins(hook: keyof MessagePlugin, env: MessageEnv) {
    for (const plugin of this.plugins) {
      if (plugin[hook]) {
        await plugin[hook]!(env);
      }
    }
  }
}

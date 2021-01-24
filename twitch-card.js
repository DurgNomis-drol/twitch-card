/*jshint esversion: 9 */
class TwitchCard extends HTMLElement {
  set hass(hass) {
    const entityId = this.config.entity;
    const state = hass.states[entityId];

    if (state === undefined) {
      this.innerHTML = `
        <ha-card>
          <div style="display: block; color: black; background-color: #fce588; padding: 8px;">
            Entity not found: ${entityId}
          </div>
        </ha-card>
      `;
      return;
    }

    const name = this.config.title || state.attributes['friendly_name'];

    if (!this.content) {
      const card = document.createElement('ha-card');
      this.content = document.createElement('div');
      const style = document.createElement('style');
      style.textContent = `
        twitch-card {
          width: 100%;
          height: 100%;
          margin: 0 0 0 0;
          padding: 0 0 0 0;
          position: relative;
        }
        twitch-card ha-card{
          width: 100%;
          height: 100%;
          margin: 0 0 0 0;
          padding: 0 0 0 0;
        }
        twitch-card img {
          width: 100%;
          height: 100%;
          margin: 0 0 0 0;
        }
        twitch-card .live {
          background: green;
          border-radius: 50%;
          height: 12%;
          width: 12%;
          box-shadow: 0 0 0 0 rgba(0, 128, 0, 1);
          transform: scale(1);
          animation: pulse 2s infinite;
          color: green;
          position: absolute;
          top: 10%;
          left: 10%;
        }
        twitch-card .is-live {
          border-radius: var(--ha-card-border-radius) var(--ha-card-border-radius) 0 0;
        }
        twitch-card .offline {
          border-radius: var(--ha-card-border-radius);
          -webkit-filter: grayscale(100%);
          opacity: 0.7;
          filter: alpha(opacity=70);
        }
        twitch-card .container {
          text-align: center;
          color: white;
          height: 100%;
          padding: 0;
        }
        twitch-card .underimage {
          width: 100%;
          font-size: 1.3em;
          color: var(--primary-text-color);
          background-color: var(--card-background-color);
          border-radius: 0 0 var(--ha-card-border-radius) var(--ha-card-border-radius);
          padding: 3px 0 0 0;
        }
        twitch-card .game {
          width: 100%;
          font-size: 1em;
          color: var(--secondary-text-color);
          background-color: var(--card-background-color);
          border-radius: 0 0 var(--ha-card-border-radius) var(--ha-card-border-radius);
          padding: 0 0 2px 0;
        }
        twitch-card .bottom {
          position: absolute;
          width: 100%;
          bottom: 0px;
          font-size: 1.3em;
          color: var(--primary-text-color);
          background-color: var(--card-background-color);
          border-radius: 0 0 var(--ha-card-border-radius) var(--ha-card-border-radius);
          padding: 5% 0 5% 0;
          opacity: 0.95;
        }
        @keyframes pulse {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(0, 128, 0, 0.7);
          }

          70% {
            transform: scale(1);
            box-shadow: 0 0 0 10px rgba(0, 128, 0, 0);
          }

          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(0, 128, 0, 0);
          }
        }
        `;
      card.appendChild(style);
      card.appendChild(this.content);
      this.appendChild(card);
    }

    if (state.state != 'unknown') {
      var streamer = {
        'state': state.state,
        'channel': state.attributes['friendly_name'],
        'game': state.attributes['game'],
        'title': state.attributes['title'],
        'picture': state.attributes['entity_picture'],
        'followers': state.attributes['followers'],
      };
    }

    var picture = streamer['picture'];

    if (this.config.image) {
      picture = this.config.image;
    }

    var tablehtml = "";

    if (streamer['state'] == 'streaming') {
      tablehtml += `
          <div class="container">
            <a target="_blank" href="https://twitch.tv/${streamer['channel']}"><img src="${picture}" class="is-live"></img></a>
            <div class="live"></div>
            <div class="underimage">${streamer['channel']}</div>
            <div class="game">${streamer['game']}</div>
          </div>
      `;

    } else {
      tablehtml += `
          <div class="container">
            <a target="_blank" href="https://twitch.tv/${streamer['channel']}"><img src="${picture}" class="offline"></img></a>
            <div class="bottom">${streamer['channel']}</div>
          </div>
      `;
    }


    this.content.innerHTML = tablehtml;
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error('You need to define an entity');
    }
    this.config = config;
  }

  getCardSize() {
    return 1
  }
}

customElements.define('twitch-card', TwitchCard);

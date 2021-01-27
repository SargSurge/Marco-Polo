import React, { Component } from "react";
import NavBar from "../modules/NavBar/NavBar";
import facility from "./assets/facility.png";
import marcoUI from "./assets/marco-ui.png";
import poloUI from "./assets/polo-ui.png";
import safehouse from "./assets/safehouse.png";

import "./HowTo.css";

export class HowTo extends Component {
  render() {
    return (
      <div className="howto-base">
        <NavBar logoutButton={this.props.logoutButton} />
        <div className="howto-content">
          <div className="howto-header">
            <h1>How to Play Marco Polo</h1>
          </div>
          <div className="howto-content">
            <h3 className="howto-subheader">Marco vs Polos</h3>
            <h5 className="howto-subheader">The Marco</h5>
            <p>
              At the start of the game, 1 player in the lobby is randomly designated as the marco,
              the rest are polos. The marco's goal is to tag all the polos before the game timer
              runs out. At the marco's disposal is the ability, Illuminate. This ability gives the
              marco 3x vision that flashes 3 times before going on a temporary cooldown. Finally,
              when the marco is near a player the tag button is enabled for the player to click.
            </p>
            {/* Pictures of marco UI */}
            <img src={marcoUI} />
            <h5 className="howto-subheader">The Polos</h5>
            <p>
              The Polos' goal is to evade the marco and run out the clock. To help with this, the
              ability, Warp, can be activated to randomly teleport to one of many warp locations on
              the map.
            </p>
            {/* Pictures of polo UI */}
            <img src={poloUI} />
            <h3 className="howto-subheader">The Maps</h3>
            <h5 className="howto-subheader">Facility</h5>
            <img src={facility} />

            <p>
              The polos are captured and are being held captive by the marco in the facility, a
              large and mostly symmetrical map with many rooms and crevices to hide in. After years
              of being prisoners, the polos hatch up a master plan... one of the polos has made
              contact with backup and are awaiting extraction. Unfortunately the marco catches wind
              of the plan, and chaos erupts in the facility. The polos break out of their cells and
              are now loose in the facility... the goal now? To evade capture until their rescue
              comes.
            </p>
            <h5 className="howto-subheader">Safehouse</h5>
            <img src={safehouse} />

            <p>
              A group of polos has found themselves with no place to hide. Their last hope lies in
              the Safehouse, a small asymmetrical map. The marco, with revenge on their agenda, has
              tracked down the location of the Safehouse. The lights are flickering... they are
              off... the polos are now running on flashlights. Thanks to the power outage the marco
              has gained access to the Safehouse. The polos must now evade the marco until the power
              comes back.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default HowTo;


import { expect } from "chai";
import { BiomassCombustors } from "../../src/cards/BiomassCombustors";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectPlayer } from "../../src/inputs/SelectPlayer";
import { Resources } from '../../src/Resources';

describe("BiomassCombustors", function () {
    it("Should throw", function () {
        const card = new BiomassCombustors();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(card.canPlay(player, game)).to.eq(false);
        game.increaseOxygenLevel(player, 2); // 2
        game.increaseOxygenLevel(player, 2); // 4
        game.increaseOxygenLevel(player, 2); // 6
        expect(game.getOxygenLevel()).to.eq(6);
        const action = card.play(player, game);
        if (action !== undefined) {
            expect(action instanceof SelectPlayer).to.eq(true);
            expect(function () { action.cb(player); }).to.throw("No plant production to decrease for selected player");
        }
    });
    it("Should play", function () {
        const card = new BiomassCombustors();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        game.increaseOxygenLevel(player, 2); // 2
        game.increaseOxygenLevel(player, 2); // 4
        game.increaseOxygenLevel(player, 2); // 6
        expect(game.getOxygenLevel()).to.eq(6);
        const action = card.play(player, game);
        if (action !== undefined) {        
            player.setProduction(Resources.PLANTS);
            action.cb(player);
            expect(player.getProduction(Resources.PLANTS)).to.eq(0);
            expect(player.getProduction(Resources.ENERGY)).to.eq(2);
            player.victoryPoints += card.getVictoryPoints();
            expect(player.victoryPoints).to.eq(-1);
        }
    });
});

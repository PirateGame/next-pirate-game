import Router from 'next/router'
import Link from 'next/link'
import Layout from '../components/Layout'


export default function Rules(){
    return (
        <Layout>
            <div className="bg-generic">
            <br /><br /><br /><br />
            <h1 className="title1">Rules</h1>
            <br /><br />
            <div className="rules-box">
                <h1>
                Ahoy, me hearties.
                </h1>
                <h3> Here be your chance to conquer the seven seas, and show your fellow pirates who is the true Scourge. The risks will be plentiful, and the disappointments
                big, but the rewards will be greater than you could ever imagine. Aye, this be the true test of wit, skill, and complete luck. This be, matey, the Pirate Game!
                </h3>
                <h2>The Battle</h2>
                <h3>
                The battle consists of 3 simple tasks even useless swaps can undertake, but only few swashbucklers can truly master:
                <br />
                1. Join a pirate captain and ship
                <br />
                2. Draw your treasure map
                <br />
                3. Collect precious gold coins whilst pillaging unsuspecting scallywags
                <br />
                4. Be the richest pirate to become the Scourge of the Seven Seas
                <br />
                </h3>
                <h2>Task 1: Join a Pirate Captain and Ship</h2>
                <h3>
                Now in order to embark on your quest for the motherload, you will need to befriend a pirate captain, and board a ship together to sail the seas together. There will be three of
                each that you will have to choose from, and they will play an important factor in what happens later in the game.
            
                Your first choice will be which pirate captain you will join, out of the following three:
                <br /><br />
                1. Captain Hook
                <br />
                2. Blackbeard
                <br />
                3. Jack Sparrow
                <br />
            
                Once selecting this, you will then have to choose the pirate ship you will be embarking your quest on, out of the following three:
                <br /><br />
                1. Jolly Rodger
                <br />
                2. Barnacle
                <br />
                3. Queen Anne's Revenge
                <br />
                </h3>
                <h2>Task 2: Draw Your Treasure Map</h2>
                <h3>
                As well as your pirate ship and captain, you will also need a treasure map in order to find and collect a booty-load of gold coins. This treasure map will mainly consist of
                amounts of gold for you to accumulate as you travel the shores, but also contains many booby traps to plunder your enemies for even greater bounties. Your treasure map will
                contain the same set of treasures and booby traps as the other buccaneers undertaking this adventure with you, however they will all be unique, as it is up to you to decide
                which squares in your grid will contain each type of space within the specific time limit at the start of the game.
                <br /><br />
                After you finish filling in your treasure map, check you're happy with it, as once you've submitted it, you cannot change it for the rest of the game. Once submitted, join
                your captain on the ship both previously selected and set sail on your quest to conquer the seven seas!
                <br /><br />
                </h3>
                <h2>Task 3: Collect Precious Gold Coins Whilst Pillaging Unsuspecting Scallywags</h2>
                <h3>
                <br />
                You've got your captain, your ship and your treasure map, and are currently sailing the seas in search of your well deserved treasure, but there's still one big question: where
                should you search first for the loot? The game will consist of the same number of turns as squares on your treasure map, and on each turn you will move through 3 phases,
                which are:
                <br />
                1. A square is selected and crossed off for all pirates
                <br />
                This square will be the same for all players, and is normally selected at random, although most players will have the opportunity to select one at some point in the game
                (see Phase 3). Each pirate will cross off what they chose to place in that position of their treasure map, and then will complete actions accordingly.
                <br />
                2. Pirates who landed on treasure squares add gold coins to their current stash
                <br />
                If any pirates have one of their squares will an amount of gold coins selected, they gain gold in their stash equal to the value of that square on their treasure map.
                Simples!
                <br />
                3. Pirates who landed on booby traps complete the action on that square
                <br />
                If any pirates land on any of the squares in their treasure map listed within the 'Booby Trap Pack' (see Task 2), they have an action to complete during their turn. There
                are 3 different types of action: Public Passive, Public Active, and Private.
                <br />
                The first type of action, 'Public Passive', consists of the Rob, Kill, Present, Swap and Skull and Crossbones squares. If any pirates arrive at these spaces, their names
                will be put into an order at random and will complete their actions accordingly.
                <br />
                If a pirate lands on a 'Rob' square, they choose another pirate and take all of their gold coins from their stash
                <br />
                If a pirate lands on a 'Kill' square, they choose another pirate and destroy all of their gold coins in their stash AND their treasure chest
                <br />
                If a pirate lands on a 'Present' square, they choose another pirate and give theim 1000 of their OWN gold coins (or as much as they can)
                <br />
                If a pirate lands on a 'Swap' square, they choose another pirate and swap their stash of gold coins with them
                <br />
                If a pirate lands on a 'Skull and Crossbones' square, they choose either a pirate captain or a pirate ship, and all the pirates in their captain or on that ship have all their
                gold coins in their stash destroyed
                <br />
            
                These actions are 'Public Passive' actions, as whatever you choose will be shown publicly to all other pirates, including the amounts that you steal and swap with other
                pirates, but you only do them when told to, so are passive actions.
                <br />
                The next action, Choose Next Square, is a 'Public Active' action, as when this square is selected, you have to declare it as quickly as you can by clicking on it. This is
                because if any other pirates have also landed on their Choose Next Square place on their map, it is the first one to declare it who gets to use it, and any others will be
                lost! If a pirate lands on a 'Choose Next Square' square, they choose the next square after all other public actions have been completed, instead of it being picked at
                random, and you can only choose squares on your map that have not been visited yet.
                <br />
                The final type of actions are 'Private' actions, as when these are landed on,
                </h3>
            </div>
                </div>
        </Layout>
    )
}
//FirstRun
import FirstRunMain from '../svelte/firstRun/FirstRunMain.svelte';
import FirstRunIntro from '../svelte/firstRun/FirstRunIntro.svelte';
import FirstRunWallet from '../svelte/firstRun/FirstRunWallet.svelte';
import FirstRunCreate from '../svelte/firstRun/FirstRunCreate.svelte';
import FirstRunRestore from '../svelte/firstRun/FirstRunRestore.svelte';
import FirstRunCreatePW from '../svelte/firstRun/FirstRunCreatePW.svelte';
import FirstRunTOS from '../svelte/firstRun/FirstRunTOS.svelte';

//Coins
import CoinsMain from '../svelte/coins/CoinsMain.svelte';
import Coin from '../svelte/coins/Coin.svelte';
import CoinDetails from '../svelte/coins/CoinDetails.svelte';
import CoinPublicKey from '../svelte/coins/CoinPublicKey.svelte';
import CoinSend from '../svelte/coins/CoinSend.svelte';
import CoinAdd from '../svelte/coins/CoinAdd.svelte';

//Swaps
import SwapsMain from '../svelte/swaps/SwapsMain.svelte';

//Misc
import LockScreen from '../svelte/misc/LockScreen.svelte';
import Modal from '../svelte/misc/Modal.svelte';

const FirstRun = {};
FirstRun.pages = { FirstRunMain, FirstRunIntro, FirstRunWallet, FirstRunCreate, FirstRunRestore, FirstRunCreatePW, FirstRunTOS };

const Pages = { CoinsMain,CoinDetails,SwapsMain, LockScreen };

const Modals = { CoinSend, CoinPublicKey, CoinAdd };

export {
    FirstRun,
    Pages,
    Modals,
    CoinsMain,
    Coin,
    CoinDetails,
    CoinPublicKey,
    CoinSend,
    CoinAdd,
    SwapsMain,
    LockScreen,
    Modal,
};



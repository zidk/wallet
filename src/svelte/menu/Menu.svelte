<script>
	import { fly } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    
    //Components
    import { MenuBox }  from '../Router.svelte'
    
    //Images
    import about from '../../img/menu_icons/icon_about.svg';
    import backup from '../../img/menu_icons/icon_backup.svg';
    import devtools from '../../img/menu_icons/icon_devtools.svg';
    import feedback from '../../img/menu_icons/icon_feedback.svg';
    import history from '../../img/menu_icons/icon_history.svg';
    import holdings from '../../img/menu_icons/icon_holdings.svg';
    import restore from '../../img/menu_icons/icon_restore.svg';
    import signout from '../../img/menu_icons/icon_signout.svg';
    import ide from '../../img/menu_icons/icon_ide.svg';
    import swap from '../../img/menu_icons/icon_swap.svg';

    let menus = [
        {
            heading: 'Wallet',
            items:[
                {id:"accounts", logo: holdings, name: 'Accounts', page: {name: 'CoinsMain'}},
                {id:"smart-contracts", logo: ide, name: 'Smart Contracts', page: {name: 'IdeMain'}},
                {id:"token-swap", logo: swap, name: 'Token Swap', page: {name: 'Swaps'}},
                {id:"devtools", logo: devtools, name: 'Developer Tools', page: {name: 'DevToolsMain'}},
            ]
        },
        {
            heading: 'Safety & Security',
            items:[
                {id:"backup", logo: backup, name: 'Backup Wallet', page: {name: 'Backup'}},
                {id:"restore", logo: restore, name: 'Restore Wallet', page: {name: 'Restore'}},
                {id:"lock", logo: signout, name: 'Sign out & Lock', page: {name: 'LockScreen'}},
            ]
        },
        {
            heading: 'About & Info',
            items:[
                {id:"about", logo: about, name: 'About', page: {name: 'About'}},
                {id:"feedback", logo: feedback, name: 'Give Feedback', page: {name: 'Feedback'}},
            ]
        },
    ]

</script>

<style>
.menus{
    position: fixed;
    padding: 21px 0px 0px 40px;
    width: 46px;
}

@media (min-width: 900px) {
    .menus{
        width: 240px;
    }
}

</style>

<div class="menus flex-column text-primary" in:fly="{{delay: 0, duration: 500, x: -50, y: 0, opacity: 0.0, easing: quintOut}}">
    {#each menus as menu}
        <MenuBox heading={menu.heading} menuItems={menu.items} />
    {/each}
</div>
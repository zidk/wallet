<script>
    import { getContext, beforeUpdate } from 'svelte';
    import { Encoder } from 'lamden-js'
    
	//Stores
    import { activeTab } from '../../js/stores/stores.js';

	//Components
    import { Components }  from '../Router.svelte';
    const { Button, InputBox, DropDown, Kwargs } = Components;

    //Utils
    import { formatKwargs } from '../../js/utils.js'

    //Context
    const { openModal } = getContext('app_functions');

    //Props
    export let methods;

    $: argValues = {}
    $: newMethods = [...methods]

    beforeUpdate (() => {
        argValues = {}
    })

    const handleRun = (index) => {
        let kwargs = {};
        methods[index].arguments.forEach(arg => {
            if (arg.value !== ''){
                try{
                    kwargs[arg.name] = Encoder(arg.type, arg.value)
                }catch (e) {
                    kwargs[arg.name] = e.message
                }
            } 
        })
    	openModal('IdeModelMethodTx', {
			'contractName': $activeTab.name, 
            'methodName': methods[index].name, 
            kwargs: formatKwargs(argValues[index])
        })
    }
    const handleNewArgValues = (e) => {
        argValues[e.detail.methodIndex] = e.detail.argumentList
    }
</script>

<style>
.methods{
    flex-wrap: wrap;
}
.name-row{
    align-items: center;
}
.method{
    border: 1px solid #e0e0e017;
    border-radius: 4px;
    padding: 1rem;
    margin: 1rem 1rem 0 0;
    max-width: calc(100% / 2.18);
    min-width: 435px;
    width: 100%;
    background: #262626;
    box-shadow: 0px 1px 2px #0823303d, 0px 2px 6px #08233029;
}
.heading{
    margin: 2em 0 0;
}

</style>

<h2 class="heading">Contract Methods</h2>
<div class="methods flex-row">
    {#each newMethods as method, methodIndex}
        <div class="method" >
            <div class="flex-row name-row">
                <h3>{method.name}</h3>
                <Button 
                    name={'run'} 
                    height={'22px'} 
                    margin={'0 0 0 10px'}
                    padding={'0 5px'}
                    classes={'button__solid button__purple'}
                    click={() => handleRun(methodIndex)}/>
            </div>

            {#if method.arguments}
                <Kwargs argumentList={method.arguments} on:newArgValues={handleNewArgValues} {methodIndex} backgroundColor="#262626"/>
            {:else}
                <p>This function takes no arguments</p>
            {/if}
        </div>
    {/each}
 </div>

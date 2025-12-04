<script lang="ts">
	export let activity = '';
	export let details = '';
	export let state = '';
	export let image = 'default.webp';
	export let smallImage = '';
	export let isActivity = false;
	export let elapsed = '';
</script>

<div class="rpc-box">
	<div class="rpc-main">
		<div class="rpc-images">
			{#if image}
				<img
					src={image}
					alt={activity}
					class="big"
					style="border-radius: {isActivity ? '12px' : '50%'};"
					on:error={(e) => {
						const target = e.target as HTMLImageElement;
						target.src = 'default.webp';
					}}
				/>
			{/if}

			{#if smallImage}
				<img
					src={smallImage}
					alt="Small icon"
					class="small"
					on:error={(e) => {
						const target = e.target as HTMLImageElement;
						target.style.display = 'none';
					}}
				/>
			{/if}
		</div>

		<div class="rpc-text">
			<h3>{activity || 'No Activity'}</h3>

			{#if details}
				<h5 class="details">{details}</h5>
			{/if}

			{#if state}
				<h5 class="state">{state}</h5>
			{/if}

			{#if isActivity && elapsed}
				<h5 class="elapsed">{elapsed}</h5>
			{/if}
		</div>
	</div>
</div>

<style lang="scss">
	.rpc-box {
		background: rgba(25, 25, 25, 1);
		border-radius: 12px;
		padding: 1rem;
	}

	.rpc-main {
		display: flex;
		gap: 1rem;
		align-items: center;
		width: 100%;
	}

	.rpc-images {
		position: relative;
		flex-shrink: 0;
	}

	.big {
		height: 100px;
		width: 100px;
		object-fit: cover;
		user-select: none;
		transition: all 0.3s ease;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
	}

	.small {
		height: 32px;
		width: 32px;
		border-radius: 50%;
		position: absolute;
		bottom: -8px;
		right: -8px;
		object-fit: cover;
		background-color: var(--bg-color, #1e1e1e);
		border: 3px solid var(--bg-color, #1e1e1e);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
	}

	.rpc-text {
		flex: 1;
		min-width: 0;

		h3 {
			margin: 0 0 0.5rem 0;
			font-size: 1.2rem;
			font-weight: 600;
			line-height: 1.3;
		}

		h5 {
			margin: 0.25rem 0;
			font-size: 0.9rem;
			font-weight: 400;
			opacity: 0.8;
			line-height: 1.4;

			&.details {
				font-weight: 500;
			}

			&.state, &.elapsed {
				font-size: 0.85rem;
				opacity: 0.7;
			}
		}
	}

	@media (max-width: 768px) {
		.rpc-main {
			flex-direction: column;
			align-items: flex-start;
			gap: 1rem;
		}

		.big {
			height: 80px;
			width: 80px;
		}

		.small {
			height: 28px;
			width: 28px;
		}

		.rpc-text {
			width: 100%;
		}
	}
</style>
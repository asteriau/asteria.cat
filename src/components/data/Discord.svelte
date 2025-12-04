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
		padding: 16px;
		height: 180px !important;
		min-height: 180px !important;
		max-height: 180px !important;
		display: flex;
		flex-direction: column;
		justify-content: center;
		box-sizing: border-box;
		width: 100%;
	}

	.rpc-main {
		display: flex;
		gap: 1rem;
		align-items: center;
		width: 100%;
		justify-content: center;
		flex-wrap: wrap;
		height: 100%;
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
		max-width: calc(100% - 120px); 

		h3 {
			margin: 0 0 0.5rem 0;
			font-size: 1.2rem;
			font-weight: 600;
			line-height: 1.3;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
		}

		h5 {
			margin: 0.25rem 0;
			font-size: 0.9rem;
			font-weight: 400;
			opacity: 0.8;
			line-height: 1.4;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;

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
		.rpc-box {
			height: 160px !important;
			min-height: 160px !important;
			max-height: 160px !important;
			padding: 12px;
		}

		.rpc-main {
			flex-direction: column;
			align-items: center;
			gap: 0.75rem;
			justify-content: center;
			height: 100%;
		}

		.big {
			height: 80px;
			width: 80px;
		}

		.small {
			height: 28px;
			width: 28px;
			bottom: -6px;
			right: -6px;
		}

		.rpc-text {
			width: 100%;
			max-width: none;
			text-align: center;
			flex: none;
			
			h3 {
				font-size: 1.1rem;
				margin-bottom: 0.25rem;
				-webkit-line-clamp: 1;
			}

			h5 {
				font-size: 0.85rem;
				margin: 0.15rem 0;
				white-space: normal;
				overflow: visible;
			}
		}
	}

	@media (max-width: 480px) {
		.rpc-box {
			height: 140px !important;
			min-height: 140px !important;
			max-height: 140px !important;
			padding: 10px;
		}

		.rpc-main {
			gap: 0.5rem;
		}

		.big {
			height: 60px;
			width: 60px;
		}

		.small {
			height: 24px;
			width: 24px;
			bottom: -4px;
			right: -4px;
			border-width: 2px;
		}

		.rpc-text {
			h3 {
				font-size: 1rem;
			}

			h5 {
				font-size: 0.8rem;
				line-height: 1.3;
			}
		}
	}

	@media (max-width: 360px) {
		.rpc-box {
			height: 130px !important;
			min-height: 130px !important;
			max-height: 130px !important;
			padding: 8px;
		}

		.rpc-main {
			gap: 0.4rem;
		}

		.big {
			height: 50px;
			width: 50px;
		}

		.rpc-text {
			h3 {
				font-size: 0.9rem;
			}

			h5 {
				font-size: 0.75rem;
			}
		}
	}
</style>
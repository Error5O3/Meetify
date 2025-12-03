<template>
    <div class="popup">
        <div class="popup-inner">
            <slot/>
        </div>
    </div>
</template>

<script>
export default {
}
</script>

<style scoped>
.popup {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99;
    background-color: rgba(0,0,0,0.2);

    display: flex;
    align-items: center;
    justify-content: center;
}

.popup-inner {
    background: white;
    padding: 24px;
    border-radius: 20px;
    border: 2px solid var(--mid);
    min-width: 333px;
}
</style>
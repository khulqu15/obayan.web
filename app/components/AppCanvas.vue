<template>
    <v-stage :config="stageConfig">
        <v-layer>
            <v-rect :config="rectConfig" />
            <v-text :config="textConfig" />
        </v-layer>
    </v-stage>
</template>

<script setup lang="ts">
const stageConfig = {
    width: 600,
    height: 400
}

const rectConfig = {
    x: 80,
    y: 80,
    width: 200,
    height: 120,
    fill: '#3b82f6',
    draggable: true
}

const textConfig = {
    x: 80,
    y: 230,
    text: 'Hello Vue Konva + Nuxt 4',
    fontSize: 24,
    fill: '#111827'
}
</script>
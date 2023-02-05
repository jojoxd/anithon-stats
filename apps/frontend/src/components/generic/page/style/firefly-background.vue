<script lang="ts">
    import {computed, defineComponent, toRefs, useAttrs} from "vue";

    export default defineComponent({
        inheritAttrs: false,

        props: {
            scale: {
                type: Number,
                default: 1.0,
            },

            bodyColor: {
                type: String,
                default: 'aliceblue',
            },

            lightColor: {
                type: String,
                default: 'yellow',
            },
        },

        setup(props) {
            const {
                bodyColor,
                lightColor,
            } = toRefs(props);

            const attrs = useAttrs();

            const style = computed(() => {
                return {
                    '--body-color': bodyColor.value,
                    '--light-color': lightColor.value,
                };
            });

            return {
                attrs,
                quantity: 5,
                style,
            };
        },
    });
</script>

<template>
    <div class="fireflies-container" v-bind="attrs">
        <ul class="fireflies d-inline-block">
            <li v-for="i of quantity"></li>
        </ul>
    </div>
</template>

<style scoped lang="scss">
    .fireflies-container {
        position: absolute;
        display: inline-block;
        top: 0;
    }
    ul.fireflies {
        list-style: none;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        position: relative;

        li {
        	background-size: cover;
        	background-image: url(http://i.imgur.com/aa7Rw.png);
        	width: 21px;
        	top: -20px;
        	height: 21px;
        	position: absolute;
        	animation:
        		leftright 24s infinite cubic-bezier(.39,.0,.63,1),
        		updown 8s infinite 1.25s cubic-bezier(.39,.0,.63,1);

            &:nth-of-type(2) {
                animation-delay: 4s;
                animation-duration: 17s, 8s;
            	animation-fill-mode: backwards, backwards;
            }
            &:nth-of-type(3) {
                animation-delay: 1.5s;
                animation-duration: 14s, 7s;
                animation-fill-mode: backwards, backwards;
            }
            &:nth-of-type(4) {
                animation-delay: 5.5s;
                animation-duration: 10s, 13s;
            }
            &:nth-of-type(5) {
                animation-fill-mode: backwards, backwards;
                animation-duration: 12s, 15s;
            }
        }
    }


    @keyframes leftright {
      0%, 100% {
        left: 20%;
      }

      16.666%	{
        left:90%;
      }

      33.333% {
        left:10%;
      }

      50% {
        left:50%;
      }

      66.666% {
        left:70%;
      }

      83.333% {
        left:40%;
      }
    }

    $scale: v-bind(scale);

    @keyframes updown {
      0%, 100% {
        top:0;
        width: calc(#{$scale} * 20px);
        height: calc(#{$scale} * 20px);
      }
      25% {
        top: 70%;
      }
      50% {
        top: 50%;
        width: calc(#{$scale} * 30px);
        height: calc(#{$scale} * 30px);
      }
      75% {
        top: 70%;
        width: calc(#{$scale} * 10px);
        height: calc(#{$scale} * 10px);
      }
    }
</style>
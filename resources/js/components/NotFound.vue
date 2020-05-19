<template>
    <div class="container">
        <div class="row justify-content-center mt-3 mb-3">
            <div class="col-md-12">
                <h3 class="absolute-center"><b>Oops! 404 Page Not Found</b></h3>
                <img :src="loadSvg()" alt="">
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        methods: {
            loadSvg(){
                return '/svgs/not-found.svg'
            }
        },
        mounted() {
            //console.log('Component mounted.')
        }
    }
</script>

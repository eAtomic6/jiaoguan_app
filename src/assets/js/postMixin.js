import { mapGetters, mapMutations } from 'vuex'

const postMixin = {
    data() {
        return {
            progressList: [], //后期进度数据
            loading: false
        }
    },
    methods: {
        postProgressFn(id) {
            this.$ajax.get('/api/postSigning/getLastStepList',{
                id: id
            }).then(res => {
                res = res.data;
                if(res.status === 200){
                    this.progressList = res.data;
                    this.loading = true
                }
            }).catch(err =>{
                this.loading = true
                this.$toast(err)
            })
        },
        ...mapMutations([ 'setPostProgressData','setReportTab'])
    },
    computed: {
        power() {
            return this.getPowerCode
        },
        ...mapGetters([
            'getPostRow',
            'getUserMsg',
            'getPostProgressData',
            'getPowerCode'
        ])
    },
}

export {
    postMixin,
}

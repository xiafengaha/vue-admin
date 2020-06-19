/**
方案明细
*/
<template>
	<div class="scheme__details-container">
		<transition name="el-zoom-in-top">
			<el-table
				:header-cell-style="headerRowStyle"
				:cell-style="insureCellStyle"
				:data="schemeDetails"
				v-show="showTable"
			>
				<el-table-column prop="displayName" align="center" width="540" label="保障范围"></el-table-column>
				<el-table-column prop="displayValue" align="center" width="540" label="保障额度"></el-table-column>
			</el-table>
		</transition>
	</div>
</template>

<script type="text/ecmascript-6">
import { headerRowStyle, insureCellStyle } from "utils/style";
export default {
	name: "schemeDetails",
	props: {
		schemeDetails: {
			type: Array,
			default: () => []
		},
		showTable: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {};
	},
	components: {},
	mounted() {},
	methods: {
		headerRowStyle,
		insureCellStyle
	},
	computed: {}
};
</script>

<style  lang="scss">
@import "~styles/variable";
.scheme__details-container {
	display: inline-block;
	.el-table {
		width: 100%;
		margin-bottom: 16px;
		border: 1px solid #e2e2e2;
		border-bottom: 0;
	}
}
</style>

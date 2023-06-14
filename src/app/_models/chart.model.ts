
export class Chart {
    uid: string;
    chartid: number;
    date: any;
    type: string;
    height: string;
    width: string;
    bgColor: string;
    title: string;
    subtitle: string;
    titleX: string;
    titleY: string;
    titleFontStyle: string;
    titleFontWeight: string;
    labelFontStyle: string;
    labelFontWeight: string;
    dataX: any[];
    dataY: any[];
    legends: string[];
    description: string;

    constructor(uid: string, chartid: number, date: any, type: string, height: string, width: string, bgColor: string, title: string, subtitle: string, titleX: string, titleY: string, titleFontStyle: string, titleFontWeight: string, labelFontStyle: string, labelFontWeight: string, dataX: any[], dataY: any[], legends: string[], description: string) {
        this.uid = uid;
        this.chartid = chartid;
        this.date = date;
        this.type = type;
        this.height = height;
        this.width = width;
        this.bgColor = bgColor;
        this.title = title;
        this.subtitle = subtitle;
        this.titleX = titleX;
        this.titleY = titleY;
        this.titleFontStyle = titleFontStyle;
        this.titleFontWeight = titleFontWeight;
        this.labelFontStyle = labelFontStyle;
        this.labelFontWeight = labelFontWeight;
        this.dataX = dataX;
        this.dataY = dataY;
        this.legends = legends;
        this.description = description;
    }
}
// 序列化请求参数到url
export const serialize = (obj) => {
  const str = [];
  Object.keys(obj).forEach((key) => {
    let value = obj[key];
    if (typeof (value) === 'object') {
      value = encodeURIComponent(JSON.stringify(obj[key]));
    } else {
      value = encodeURIComponent(value);
    }
    str.push(`${encodeURIComponent(key)}=${value}`);
  });
  return str.join('&');
};
// 反序列化URL请求参数转对象
export const urlParser = (url = location.href) => {
  const obj = {};
  try{
    const arr = url.split('?')[1].split('&');   // 先通过？分解得到？后面的所需字符串，再将其通过&分解开存放在数组里
    for (const i of arr) {
      // eslint-disable-next-line prefer-destructuring
      obj[i.split('=')[0]] = i.split('=')[1];  // 对数组每项用=分解开，=前为对象属性名，=后为属性值
    }
  }catch (error) {}
  return obj;
};
// 数组分组
export const groupBy = (array, f) => {
  const groups = {};
  array.forEach((o) => {
    const group = JSON.stringify(f(o));
    groups[group] = groups[group] || [];
    groups[group].push(o);
  });
  return Object.keys(groups).map((group) => groups[group]);
};

// 深度拷贝
export const deepClone = (obj) => {
  const objClone = Array.isArray(obj) ? [] : {};
  if (obj && typeof obj === 'object') {
    /* eslint-disable */
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        // 判断ojb子元素是否为对象，如果是，递归复制
        if (obj[key] && typeof obj[key] === 'object') {
          objClone[key] = deepClone(obj[key]);
        } else {
          // 如果不是，简单复制
          objClone[key] = obj[key];
        }
      }
    }
  }
  return objClone;
};
// 格式化日期
export const  dateFormat = (date, fmt) => {
  let ret;
  const opt = {
    "y+": date.getFullYear().toString(),        // 年
    "M+": (date.getMonth() + 1).toString(),     // 月
    "d+": date.getDate().toString(),            // 日
    "H+": date.getHours().toString(),           // 时
    "m+": date.getMinutes().toString(),         // 分
    "s+": date.getSeconds().toString()          // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
    };
  };
  return fmt;
}
/**
 * 图片压缩
 * @param file
 * @returns {Promise<unknown>}
 */
export const compressImage = (file) => {
  // 大于1MB的jpeg和png图片都缩小像素上传1000000
  if (/\/(?:jpeg|png|jpg|bmp)/i.test(file.file.type) && file.file.size > 1000000) {
    return new Promise((resolve) => {
      console.log(`压缩前===>${file.file.size}`);
      // 创建Canvas对象(画布)
      const canvas = document.createElement('canvas');
      // 获取对应的CanvasRenderingContext2D对象(画笔)
      const context = canvas.getContext('2d');
      // 创建新的图片对象
      const img = new Image();
      // 指定图片的DataURL(图片的base64编码数据)
      img.src = this.createObjectURL(file.file);
      // 画布宽度
      const width = 512;
      // 监听浏览器加载图片完成，然后进行绘制
      img.onload = () => {
        // 画布大小按照图片的比例生成
        const height = width / (img.naturalWidth / img.naturalHeight);
        // 指定canvas画布大小，该大小为最后生成图片的大小
        canvas.width = width;
        canvas.height = height;
        /* drawImage画布绘制的方法。(0,0)表示以Canvas画布左上角为起点， canvas.width, canvas.height 是将图片按给定的像素进行缩小。*/
        /* 如果不指定缩小的像素，图片将以图片原始大小进行绘制，图片像素如果大于画布将会从左上角开始按画布大小部分绘制图片，最后得到的图片就是张局部图。图片小于画布就会有黑边。*/
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
        // 将绘制完成的图片重新转化为base64编码，file.file.type为图片类型，0.92为默认压缩质量
        file.content = canvas.toDataURL(file.file.type, 0.92);
        // 将base64编码的图片转成文件(file)格式
        const lastfile = this.dataURLtoFile(file.content);
        console.log(`压缩后===>${lastfile.size}`);
        // 把file转换成二进制形式(binart)并进行上传
        // func(lastfile);
        resolve(lastfile);
      };
    });
  }
  return new Promise((resolve) => resolve(file.file));
}

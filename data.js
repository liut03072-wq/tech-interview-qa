/**
 * 技术面试题库数据
 * - 深挖某题后：更新对应 id 的 answerHtml / answerText，并写 updatedAt（YYYY-MM-DD）
 * - level: base | mid | deep
 */
const CATEGORIES = [
  { id: "osnet", name: "底层 · 操作系统/网络" },
  { id: "python", name: "Python 进阶" },
  { id: "mysql", name: "MySQL" },
  { id: "redis", name: "Redis" },
  { id: "es", name: "Elasticsearch" },
  { id: "mongo", name: "MongoDB" },
  { id: "vector", name: "向量库 / 知识库" },
  { id: "api", name: "接口与系统设计" },
  { id: "mq", name: "中间件 · Kafka/ZK/Nginx" },
  { id: "llm", name: "大模型 · RAG/Agent/MCP" },
];

const BANK = [
  // ========== 底层 ==========
  {
    id: "osnet-001",
    cat: "osnet",
    level: "deep",
    tags: ["进程", "线程", "CPU", "寄存器", "栈", "上下文切换"],
    title: "进程和线程的本质区别是什么？上下文切换成本为什么不同？",
    answerText: "CPU GPU 显卡 调度器 进程 线程 寄存器 内存 外存 磁盘 栈 多核 超线程 切换时机 优先级 地址空间 入门讲解 误解纠正",
    updatedAt: "2026-11-17",
    answerHtml: `
      <h4>先建立生活类比（先有感觉）</h4>
      <ul>
        <li><b>CPU</b>：工厂里真正干活的「工人/机床」。它一次通常只做一件极细的事（取指令、算一下、写回）。</li>
        <li><b>进程（Process）</b>：一个正在运行的「整间工厂车间」。比如你打开微信，操作系统会给微信开一个进程：有自己的厂房（内存地盘）、原料仓库、规章制度。</li>
        <li><b>线程（Thread）</b>：车间里的「一条生产线/一个工人工位」。同一个微信进程里，可以一条线收消息、一条线刷新界面、一条线传文件——它们同属一个车间，共享很多设备，但各自手头工作不同。</li>
      </ul>
      <div class="tip">关系一句话：<b>CPU 执行代码；进程是程序的运行实例（资源袋子）；线程是进程里可被 CPU 调度执行的一条执行流。</b>不是「CPU 包含进程」，也不是「进程等于线程」。</div>

      <h4>它们有没有「包含」关系？</h4>
      <pre>一台电脑
 └─ 可能有多个 CPU 核心（多工人）
 └─ 操作系统同时跑很多进程（很多车间）
      └─ 每个进程里至少 1 个线程，也可以有很多线程
           └─ 某个时刻，某个 CPU 核心正在跑「某一个线程」里的几条指令</pre>
      <ul>
        <li><b>进程包含线程</b>：对。线程不能脱离进程单独存在（你平时说的用户态线程都挂在某个进程下）。</li>
        <li><b>CPU 不包含进程</b>：CPU 是硬件执行者；进程是 OS 管理的软件抽象。是「CPU 轮流执行各个线程」，不是包含。</li>
        <li>一个进程最少通常有一个主线程；多线程就是一个进程里多条执行流。</li>
      </ul>

      <h4>CPU 到底在干什么？（极简）</h4>
      <p>CPU 不断重复：从内存取下一条指令 → 执行 → 可能读写内存/寄存器。它非常快，但「手」就那么几只（核心数有限），所以操作系统用时间片轮流让不同线程用 CPU，看起来像很多程序同时在跑。</p>

      <h4>寄存器是什么？为什么线程切换要提到它？</h4>
      <p><b>寄存器</b>：CPU 芯片内部的「超级小黑板/临时草稿纸」，比内存快几个数量级。正在算的数、下一条指令在哪（程序计数器 PC）、当前栈顶在哪（栈指针 SP）等，往往先放在寄存器里。</p>
      <p>当 OS 决定「这个线程先停，换另一个线程跑」时，必须把当前线程小黑板上的内容存起来，再把另一个线程上次的小黑板内容写回去——否则换回来时算到一半的数就乱了。这就是「保存/恢复上下文」的核心部分。</p>

      <h4>「独立栈」是什么意思？</h4>
      <p><b>栈（stack）</b>：函数调用时用来放局部变量、返回地址、参数的一块内存，像叠盘子：后进先出。</p>
      <ul>
        <li>线程 A 在调 <code>foo()</code>，盘子叠到一半；</li>
        <li>若线程 B 和 A 共用同一个栈，B 一调 <code>bar()</code> 就会把 A 的盘子打乱 → 程序崩溃。</li>
        <li>所以：<b>每个线程有自己的栈</b>（独立调用现场），但同进程线程通常共享「堆、全局变量、代码段」等大片内存。</li>
      </ul>
      <pre>同一进程内存（示意）
┌─────────────────────────┐
│ 代码（大家共用）          │
│ 全局数据（大家共用）      │
│ 堆 heap（大家共用，要加锁）│
│ 线程1 的栈               │
│ 线程2 的栈               │
│ 线程3 的栈               │
└─────────────────────────┘</pre>

      <h4>进程 vs 线程：用「共享什么」区分（面试版人话）</h4>
      <ul>
        <li><b>进程</b>：资源分配单位。自己有独立的内存地盘（地址空间）。微信崩了，一般不会直接把浏览器的内存弄乱——隔离好。</li>
        <li><b>线程</b>：CPU 调度单位。同进程线程共享大半资源（内存、打开的文件等），切换轻；但共享数据要小心线程安全（加锁）。</li>
      </ul>
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        <tr><td style="border:1px solid #2a3142;padding:6px"></td><td style="border:1px solid #2a3142;padding:6px"><b>进程</b></td><td style="border:1px solid #2a3142;padding:6px"><b>同进程内的线程</b></td></tr>
        <tr><td style="border:1px solid #2a3142;padding:6px">内存地盘</td><td style="border:1px solid #2a3142;padding:6px">独立</td><td style="border:1px solid #2a3142;padding:6px">共享（各有自己的栈）</td></tr>
        <tr><td style="border:1px solid #2a3142;padding:6px">崩溃影响</td><td style="border:1px solid #2a3142;padding:6px">通常只倒自己</td><td style="border:1px solid #2a3142;padding:6px">一个线程搞坏共享内存，可能整进程挂</td></tr>
        <tr><td style="border:1px solid #2a3142;padding:6px">创建/切换成本</td><td style="border:1px solid #2a3142;padding:6px">更重</td><td style="border:1px solid #2a3142;padding:6px">更轻</td></tr>
        <tr><td style="border:1px solid #2a3142;padding:6px">通信</td><td style="border:1px solid #2a3142;padding:6px">管道、套接字等（相对麻烦）</td><td style="border:1px solid #2a3142;padding:6px">直接读写共享变量（要同步）</td></tr>
      </table>

      <h4>上下文切换为什么「进程更贵、线程更便宜」？（仍用人话）</h4>
      <ul>
        <li><b>线程切换</b>：主要换「小黑板（寄存器）+ 换到另一条栈」。还在同一间车间里干，地图（页表/地址空间）不用换。</li>
        <li><b>进程切换</b>：不但换小黑板，还要换整间车间的「门禁卡/地图」（页表），告诉 CPU：现在虚拟地址要映射到另一套物理内存。更重，所以更贵。</li>
      </ul>

      <h4>和 Python 的一点挂钩（方便后面刷 py 题）</h4>
      <ul>
        <li><code>threading</code>：同进程多线程，IO 等待时有用；算力受 GIL 影响。</li>
        <li><code>multiprocessing</code>：真开多进程，各有独立内存，适合 CPU 密集，但更「重」。</li>
      </ul>

      <h4>面试一句话收束</h4>
      <p>进程是带独立资源的运行实体；线程是进程内的执行流。CPU 用寄存器干活；切换执行流要保存寄存器；线程各有栈才能各自调函数。切换线程通常比切换进程便宜，因为不用换地址空间。</p>

      <h4>深挖补充：GPU / 显卡</h4>
      <ul>
        <li><b>GPU</b>：图形处理器芯片，擅长「同样的计算套路对很多数据并行做一遍」（成千上万小核心一起干）。</li>
        <li><b>显卡</b>：通常指整块板卡 = GPU + 显存（VRAM）+ 供电散热等。口语里常把显卡≈GPU，严格说显卡是硬件产品，GPU 是上面的计算核心。</li>
        <li><b>传统用途</b>：渲染画面（游戏、UI、视频）。</li>
        <li><b>现在更火</b>：训练/推理大模型、矩阵运算——不是只能画图，而是「大规模并行计算引擎」。</li>
        <li>和 CPU 分工：CPU 擅长逻辑复杂、分支多、系统调度；GPU 擅长大批量相似数值计算。</li>
      </ul>

      <h4>深挖补充：寄存器 ≠ 内存 ≠ 外存（速度金字塔）</h4>
      <pre>很快很小 → 很慢很大
寄存器（在 CPU 里面）
  → CPU 高速缓存 Cache
    → 内存 RAM（平常说的 8G/16G 内存）
      → 外存（SSD/硬盘）</pre>
      <ul>
        <li><b>寄存器不是内存。</b>内存是插在主板上的 RAM；寄存器在 CPU 内部，少得可怜但极快。</li>
        <li>线程被换走时：当前寄存器内容会先<strong>保存到内存里的「线程控制块」</strong>（OS 管理的数据结构），不是长期停在寄存器里等空闲；换回来时再写回寄存器继续跑。</li>
        <li>函数算完的「结果」通常写进变量（在内存/栈上），不是「先堆在寄存器里等 CPU 闲了再读」。</li>
        <li><b>没有「寄存器满了就当外存用」这种机制。</b>寄存器不够用时，编译器会把临时变量「溢出」到栈上（仍在内存）。内存不够时，OS 才可能把内存页换到硬盘（swap）——那是内存↔外存，和寄存器是两层事，而且会明显变慢。</li>
      </ul>

      <h4>深挖补充：你对「线程切换」理解的核对</h4>
      <p><b>对的部分：</b>多个线程轮流用 CPU；某个线程阻塞等待（比如等网络）时，OS 可以换别的线程跑，尽量让 CPU 别干等。——这个直觉对。</p>
      <p><b>需要改的部分：</b></p>
      <ul>
        <li>不只是「执行完了才切换」。更常见：时间片到了、主动让出、等 IO、被更高优先级抢占、睡醒等。</li>
        <li>切换时保存的是「做到一半的现场」（寄存器等），不是「已经跑完的最终结果专门存寄存器里以后再取」。</li>
      </ul>
      <h4>切换时机（常见）</h4>
      <ul>
        <li>时间片用完（抢占式调度）</li>
        <li>线程阻塞：等锁、等网络、等磁盘、sleep</li>
        <li>主动 yield / 等待条件变量</li>
        <li>更高优先级线程就绪，抢占当前线程（视系统策略）</li>
        <li>线程结束</li>
      </ul>
      <h4>有没有优先级？</h4>
      <p>有。操作系统调度器会看优先级/nice 值/实时策略等决定谁先跑、能跑多久。普通应用线程大多差不多；真正实时任务（少见）才会设很高优先级。应用层也有自己的线程池优先级，但最终能不能立刻占用 CPU，仍由 OS 调度说了算。</p>

      <h4>深挖补充：地址空间 vs「在不在一个盘」</h4>
      <p><b>对的部分：</b>一个进程有自己的地址空间（逻辑上的内存地盘）；同进程多线程共享这块地盘，所以线程切换通常不必换「内存地图」，更便宜；不同进程地址空间不同，进程切换更贵。</p>
      <p><b>需要改的部分：</b>进程切换贵，主要贵在换<strong>内存映射（页表）等</strong>，不是因为「不在同一个硬盘分区/盘符」。硬盘慢，影响的是读文件、数据库、swap；那是 IO 问题，和「上下文切换」不是同一件事。可以同时成立：进程切换本身偏贵；若再频繁读写磁盘，整体会更慢——但那是两笔账。</p>

      <h4>深挖补充：CPU 是调度器吗？谁真正执行程序？</h4>
      <ul>
        <li><b>CPU 不是任务调度器。</b>CPU 是通用计算器/执行器：取指令、运算、访存。</li>
        <li><b>调度器在操作系统里</b>（软件）：决定「下一个让哪个线程用哪个 CPU 核心、用多久」。</li>
        <li><b>真正执行「程序单位（线程里的指令）」的是 CPU 核心。</b>流程是：OS 调度选中某线程 → 把该线程现场装进某核心 → 该核心一条条执行机器指令。</li>
        <li><b>GPU 也是计算器</b>（偏并行数值），不是「唯一计算器」。日常跑 Python/微信/浏览器主逻辑，主要是 CPU；训练大模型、渲染 3D、部分视频/图像加速才会大量用 GPU。</li>
      </ul>
      <pre>谁干什么（务必分清）
OS 调度器（软件）→ 分配「谁上 CPU」
CPU 核心（硬件）→ 真正执行指令
GPU（硬件）→ 适合时做大规模并行计算/渲染
内存 RAM → 程序运行时的主工作台
磁盘/SSD（外存）→ 长期存放文件，关机还在</pre>

      <h4>深挖补充：磁盘 / 内存 / 外存</h4>
      <ul>
        <li><b>外存</b>：统称「断电还在」的存储，常见就是硬盘 HDD、固态盘 SSD、U 盘等。</li>
        <li><b>磁盘</b>：口语常指硬盘/SSD 这类外存设备（传统「磁盘」偏机械硬盘，现在很多人也把 SSD 叫盘）。</li>
        <li><b>内存 RAM</b>：正在跑的程序与数据的工作台，快；断电内容一般就没了。</li>
        <li>关系：程序和文件平时躺在磁盘上；要运行时，OS 把需要的部分装进内存，CPU 主要和内存/缓存/寄存器打交道。</li>
      </ul>

      <h4>深挖补充：寄存器是「线程的执行空间」吗？</h4>
      <p><b>不是。</b>更准确：</p>
      <ul>
        <li>线程的「执行工作区」主要在<strong>内存里的栈 + 堆等</strong>（尤其栈：函数调用、局部变量）。</li>
        <li>寄存器只是<strong>当前正在该 CPU 核心上跑的那个线程</strong>，手头正在用的几个临时格子。</li>
        <li>一个核心同一时刻通常只跑一个线程，所以那组寄存器属于「此刻占着这个核心的线程」；线程被换走，寄存器内容会保存到内存，空出核心给别人。</li>
      </ul>

      <h4>深挖补充：多核是不是「一个核固定跑一个线程」？（你选的第 2 问）</h4>
      <ul>
        <li><b>不是固定绑定。</b>默认情况下，线程可以被调度到不同核心上来回跑（有时为了性能会有亲和性绑定，那是优化，不是默认公理）。</li>
        <li>更准确：<b>一个核心同一时刻通常执行一个线程</b>；有 N 个核心，理论上可同时跑约 N 个线程。</li>
        <li>线程数往往远大于核心数（几百个线程很常见），所以每个核心上仍会时间片轮转很多线程。</li>
        <li>超线程/SMT：一个物理核露出多个逻辑核，能更好地填满执行单元，但不是「性能翻倍」的两个完整核。</li>
      </ul>
      <pre>例：8 核 CPU，系统里 200 个线程
→ 大约同时有 8 个线程真正在算
→ 其余在就绪队列等，或在阻塞等 IO
→ 某个线程这次在核3上跑，下次可能被调度到核5（通常可以）</pre>
    `,
  },
  {
    id: "osnet-002",
    cat: "osnet",
    level: "deep",
    tags: ["虚拟内存", "缺页", "TLB", "程序启动", "磁盘", "内存"],
    title: "虚拟内存、页表、缺页中断、TLB 分别解决什么问题？",
    answerText: "虚拟内存 页表 缺页 TLB 双击启动 磁盘 内存 按需加载 swap 换页 thrashing 页表与TLB区别",
    updatedAt: "2026-11-17",
    answerHtml: `
      <h4>先用人话：双击程序后，磁盘和内存怎么接力？</h4>
      <pre>1. 程序文件躺在磁盘/SSD 上（.exe / 解释器+脚本 等）
2. 你双击 → OS 创建进程（分配地址空间等）
3. 并不是把整个文件一次性全塞进内存
4. 先建立「映射」：逻辑上这些代码/数据属于这个进程
5. CPU 真正执行到某段代码/用到某块数据时
   → 发现内存里还没有 → 缺页
   → OS 从磁盘把需要的那一页读进内存
6. 之后 CPU 主要和内存（以及更上层的 Cache/寄存器）打交道
7. 内存紧张时，久不用的页可能被换回磁盘（swap）——会变慢</pre>
      <div class="tip">记住口诀：<b>磁盘是仓库，内存是工作台；按需从仓库搬到工作台，不是开店就把整个仓库搬空。</b></div>
      <ul>
        <li>为什么不一次性全加载？程序可能很大，很多功能你根本用不到；全加载又慢又浪费内存。</li>
        <li>动态库、资源文件也经常是用到再映射/再读。</li>
        <li>写文件、保存结果：往往先在内存缓冲，再落盘到磁盘（具体看程序与系统调用）。</li>
      </ul>

      <h4>虚拟内存（接上面）</h4>
      <p>给每个进程「看起来很大且连续」的地址空间，实现隔离、保护、按需加载、物理内存不够时也能靠换页硬撑（会慢）。你以为的「进程地址」，多数是虚拟地址，要靠页表翻译成真正的物理内存位置。</p>
      <h4>页表</h4>
      <p>把虚拟页号映射到物理页框。现代多为多级页表，节省页表本身占用的空间。进程切换贵，常常就包含「换一套页表/地址翻译环境」。</p>
      <h4>缺页中断</h4>
      <p>访问的页不在物理内存（或权限不符）时触发：OS 从磁盘/文件装入，或处理写时复制/权限错误。启动后前几秒卡一下、第一次用某功能顿一下，有时就是在补缺页。频繁缺页会 thrashing（狂换页，系统像假死）。</p>
      <h4>TLB</h4>
      <p>Translation Lookaside Buffer：缓存近期「虚拟→物理」翻译结果。没有它，几乎每次访存都要多次查页表，会慢到不可用。</p>
      <div class="tip">和大模型服务：向量检索/大 batch 时吃内存带宽；内存不够触发 swap 时延迟会炸——部署要盯内存。</div>

      <h4>深挖补充：虚拟内存是「概念上的内存」吗？</h4>
      <p><b>可以这么理解，更准确叫「抽象/虚拟的地址空间」。 </b>每个进程都觉得自己有一大片连续门牌号（虚拟地址），但这不等于机器上真有那么多物理内存条。</p>
      <ul>
        <li><b>不是「只有虚拟比物理大时才有虚拟内存」。 </b>即使程序很小、物理内存很够，现代 OS 也几乎总是用虚拟地址 + 页表，为了隔离和方便管理。</li>
        <li>虚拟可以「看起来」大于物理：很多进程各自以为有很大空间，但同一时刻真正装在 RAM 里的只是大家正在用的那些页。</li>
      </ul>

      <h4>深挖补充：虚拟需求 &gt; 物理内存时会发生什么？</h4>
      <p>你的直觉「会换页、可能落到硬盘、会变慢」——对。细节拆开：</p>
      <ol>
        <li><b>页表一直在做的事</b>：记录「这个虚拟页 → 现在对应哪块物理页」，或标记「不在内存里（不存在/被换出）」。不是等内存不够才突然发明页表。</li>
        <li><b>内存不够时</b>：OS 选出一些暂时不用的页，把内容写到磁盘上的交换区（Windows 页面文件 / Linux swap 等），腾出物理页给更急需的。</li>
        <li>以后程序又访问被换出的页 → <b>缺页</b> → 再从磁盘读回内存（可能还要再挤走别的页）。</li>
      </ol>
      <p><b>开销：</b>换入换出是磁盘 IO，比内存访问慢几个数量级；若大家一起狂换页（thrashing），CPU 很多时间在等盘，系统会卡成「假死」。所以部署服务要避免内存打满靠 swap 续命。</p>
      <pre>虚拟地址（门牌号）
    │
    ▼
  页表（全量地图：在不在内存？在哪一页物理内存？权限？）
    │
    ├─ 命中且在 RAM → 得到物理地址 → 访问内存
    └─ 标记为不在 RAM → 缺页 → 可能从磁盘/文件载入 → 更新页表 → 再访问</pre>

      <h4>深挖补充：页表 vs TLB（都是翻译，但层级不同）</h4>
      <p>感觉「都在翻译真实内存地址」没错，差别像：</p>
      <ul>
        <li><b>页表</b>：完整地图，放在内存里，由 OS 维护。条目多，查一次可能要走多级页表（好几次内存访问），相对慢。</li>
        <li><b>TLB</b>：CPU 里的「最近用过的翻译结果小缓存」。硬件先问 TLB：这门牌号我最近是不是翻译过？命中就立刻得到物理页；没命中再去查页表，并把结果塞进 TLB。</li>
      </ul>
      <pre>每次访存翻译路径（简化）
虚拟地址 → 先查 TLB（很快，在 CPU 里）
              ├─ 命中：直接得物理地址
              └─ 未命中：查页表（较慢，在内存里走多级）
                        → 填回 TLB → 再用</pre>
      <p>所以：<b>页表是权威账本；TLB 是热门条目的高速复印件。</b>进程切换时，往往还要处理 TLB 失效/切换（不同进程翻译不同），这也是切换成本的一部分。</p>
      <div class="tip">口诀：虚拟地址是门牌；页表是全市地图；TLB 是你口袋里常去地点的便签。</div>

      <h4>深挖补充：页表 ≈ 数据库，TLB ≈ Redis？</h4>
      <p><b>作为学习类比：成立，而且很好用。</b>都是「权威数据在慢一点的地方，热点翻译缓存在快的地方」。</p>
      <ul>
        <li><b>像的地方</b>：页表像「全量、权威」的映射表；TLB 像缓存热点查询结果；TLB 未命中再查页表 ≈ Redis miss 再查 DB。</li>
        <li><b>不像的地方（别考混）</b>：
          <ul>
            <li>页表是内核里的数据结构，不是 MySQL 那种业务数据库。</li>
            <li>TLB 是 <b>CPU 硬件里的翻译缓存</b>，不是你装的 Redis 服务；程序几乎感觉不到，由硬件+OS 自动维护。</li>
            <li>Redis 可缓存任意业务数据；TLB 只缓存「虚拟页→物理页」这类翻译条目。</li>
            <li>Redis 是可选加速层；没有像样的 TLB，现代 CPU 访存会慢到几乎不能用——它是性能标配，不是业务可选插件。</li>
          </ul>
        </li>
      </ul>
      <p>面试可以这样说：「页表是地址翻译的权威映射，TLB 是其硬件侧的热点缓存，访问路径类似 DB + 缓存，但实现层级在 CPU/OS，不是应用里的 Redis。」</p>
    `,
  },
  {
    id: "osnet-003",
    cat: "osnet",
    level: "deep",
    tags: ["用户态", "内核态", "系统调用", "异常", "IO", "缓冲"],
    title: "用户态 / 内核态切换何时发生？为什么要尽量减少？",
    answerText: "用户态 内核态 系统调用 read write socket 异常 缺页 高频小IO 缓冲 mmap io_uring 入门讲解",
    updatedAt: "2026-11-18",
    answerHtml: `
      <h4>用户态 / 内核态是什么？（先建立画面）</h4>
      <p>可以想成 CPU 跑程序时的两种「权限模式」：</p>
      <ul>
        <li><b>用户态（user mode）</b>：跑你写的普通程序（Python、App）。权限低，不能直接乱动硬件、不能随便改别的进程内存。</li>
        <li><b>内核态（kernel mode）</b>：跑操作系统内核代码。权限高，可以操作磁盘、网卡、内存管理、调度线程等。</li>
      </ul>
      <pre>你的 Python 代码 ──用户态──▶ 需要读文件/上网
                              │
                              ▼  发起系统调用（敲门进内核）
                         操作系统内核 ──内核态──▶ 真正碰磁盘/网卡
                              │
                              ▼  办完事返回
                         回到你的程序（又回到用户态）</pre>
      <div class="tip">为什么要分两态？保护系统安全。要是每个 App 都能直接操控磁盘和网卡，一个写坏的程序就能搞崩整台机器或偷别人数据。</div>

      <h4>系统调用是什么？read / write / socket 还有啥？</h4>
      <p><b>系统调用 = 程序向操作系统「正式请假办事」的接口。</b>你想做的事碰到硬件或全局资源，就必须走它，于是发生用户态→内核态→再回来。</p>
      <p><b>I/O</b> 广义就是 Input/Output：和「外部」打交道，不只硬盘读写，也包括网络、终端、很多设备。</p>
      <ul>
        <li><b>文件类</b>：<code>open/close</code>、<code>read/write</code>、<code>lseek</code>、<code>stat</code>…</li>
        <li><b>网络类</b>：<code>socket</code>、<code>bind/listen/accept</code>、<code>connect</code>、<code>send/recv</code>…</li>
        <li><b>进程/线程</b>：<code>fork/exec</code>、<code>exit</code>、<code>clone</code>、<code>wait</code>…</li>
        <li><b>内存</b>：<code>mmap/munmap</code>、<code>brk</code>（堆扩展相关）…</li>
        <li><b>时间/同步</b>：<code>nanosleep</code>、<code>futex</code>（锁等待常用）…</li>
        <li><b>其他</b>：权限、<code>ioctl</code>（设备控制）等</li>
      </ul>
      <p>Python 里 <code>f.read()</code>、<code>requests.get()</code> 底层最终都会落到这类系统调用（中间可能隔着运行时/库）。</p>

      <h4>异常是什么？和系统调用、中断有啥关系？</h4>
      <p>这里的「异常」偏 OS/CPU 术语，不完全等于 Python 的 <code>try/except</code>。</p>
      <ul>
        <li><b>异常（exception）</b>：CPU 执行到某条指令时自己发现问题，被迫停下交给 OS 处理。例如：缺页、除以 0、非法指令、访问无权限内存。</li>
        <li><b>中断（interrupt）</b>：多半是外部设备喊一声「我好了」（网卡收到包、磁盘读完），打断当前执行。</li>
        <li><b>系统调用</b>：程序主动请求进内核（有的教材也把它归入一种同步的陷入/trap）。</li>
      </ul>
      <p>共同点：都可能让 CPU 从用户态进入内核态去处理；处理完再决定回到原程序或调度别人。</p>
      <p>你前面学的「缺页」就是经典异常：访问的页不在内存 → 陷入内核 → 可能从磁盘装页 → 再继续。</p>

      <h4>高频小 I/O 是什么？为什么伤性能？</h4>
      <p><b>是的，I/O 核心就是读写类交互</b>（文件/网络等）。「高频小 I/O」指：一次只读/写一点点（比如每次 10 字节），但调用极多次。</p>
      <pre>坏例子：循环 100 万次，每次 write 1 个字符
→ 可能触发约 100 万次用户态↔内核态往返
→ CPU 大量时间花在「进门出门、保存现场、检查参数」，真正写数据的比例反而低</pre>
      <p>所以不是「读写本身一定慢」，而是<strong>每次读写都付一次进内核的门票</strong>；门票买太多次就亏。</p>

      <h4>那些工程手段靠什么原理减少切换？</h4>
      <ul>
        <li><b>缓冲（buffer）</b>：先在用户态内存里攒着，攒够一块再一次 <code>write</code>。原理：把 N 次小系统调用合成 1 次大的。</li>
        <li><b>批量读写</b>：一次读 64KB 而不是 64 次各 1KB。原理同上，摊薄每次进内核的固定成本。</li>
        <li><b>mmap</b>：把文件映射进进程地址空间，以后多像读写内存；缺页时内核再帮忙装数据。原理：减少显式 read 往返次数（不是零成本，但模式不同）。</li>
        <li><b>异步 I/O / io_uring</b>：提交一批请求，不必「发起→阻塞等→返回」来回扭。原理：减少阻塞与往返次数，让 CPU 去做别的事或一次处理多请求。</li>
        <li><b>用户态协议栈/旁路（高级场景）</b>：让数据包少走传统内核路径。原理：直接砍掉部分内核往返（运维与安全成本高，一般业务少碰）。</li>
      </ul>
      <div class="tip">和 Python 的联系：很多时候慢，是因为在循环里频繁小读写/小请求；先缓冲、合并、批量，比先上多线程更有效。</div>

      <h4>面试一句话</h4>
      <p>用户态跑应用、内核态跑 OS；碰硬件资源要走系统调用并切换模式。异常/中断也会进内核。高频小 I/O 会把时间耗在切换门票上，所以用缓冲、批量、异步等减少往返次数。</p>
    `,
  },
  {
    id: "osnet-004",
    cat: "osnet",
    level: "mid",
    tags: ["TCP", "三次握手", "四次挥手"],
    title: "TCP 三次握手、四次挥手在解决什么？TIME_WAIT 为什么存在？",
    answerText: "三次握手 四次挥手 TIME_WAIT",
    answerHtml: `
      <h4>三次握手</h4>
      <p>同步双方初始序列号，确认双向可达，避免旧重复 SYN 建立错误连接。</p>
      <h4>四次挥手</h4>
      <p>TCP 全双工，每方向各关一次：FIN/ACK ×2。若一方 FIN 后另一方仍可发数据，所以不是三次合并成固定形态（有时可合并 ACK）。</p>
      <h4>TIME_WAIT</h4>
      <ul>
        <li>主动关闭方进入 TIME_WAIT（约 2MSL）</li>
        <li>目的：保证最后 ACK 丢失时可重传；让旧连接重复报文在网络中消失，避免污染新连接</li>
      </ul>
      <p>高并发短连接服务 TIME_WAIT 过多时：调参数、复用连接（HTTP keep-alive）、或架构上减少短连接。</p>
    `,
  },
  {
    id: "osnet-005",
    cat: "osnet",
    level: "mid",
    tags: ["HTTP", "HTTP2", "HTTP3"],
    title: "HTTP/1.1、HTTP/2、HTTP/3 的关键差异？",
    answerText: "HTTP1.1 HTTP2 HTTP3 QUIC",
    answerHtml: `
      <ul>
        <li><b>1.1</b>：文本协议；队头阻塞（同连接串行）；常靠多连接并发；有 keep-alive、分块传输。</li>
        <li><b>2</b>：二进制帧；多路复用；头部压缩（HPACK）；仍基于 TCP，<strong>TCP 层队头阻塞</strong>仍在（丢包影响整连接）。</li>
        <li><b>3</b>：基于 QUIC（UDP）；连接迁移；流级别丢失恢复，减轻队头阻塞；握手更快（常合 TLS）。</li>
      </ul>
      <div class="tip">流式大模型输出常用 SSE（HTTP）或 WebSocket；选协议时关注代理缓冲、超时、断线续传。</div>
    `,
  },
  {
    id: "osnet-006",
    cat: "osnet",
    level: "deep",
    tags: ["IO模型", "select", "epoll"],
    title: "阻塞 IO、非阻塞 IO、IO 多路复用、epoll 边缘触发/水平触发怎么理解？",
    answerText: "阻塞IO 非阻塞 select epoll ET LT",
    answerHtml: `
      <h4>模型直觉</h4>
      <ul>
        <li><b>阻塞</b>：调用直到数据就绪才返回，线程被卡住。</li>
        <li><b>非阻塞</b>：立即返回 EAGAIN；需要轮询或配合多路复用。</li>
        <li><b>IO 多路复用</b>：一个线程盯多个 fd（select/poll/epoll），谁就绪处理谁。</li>
      </ul>
      <h4>epoll</h4>
      <ul>
        <li><b>LT 水平触发</b>：缓冲区还有数据就会反复通知；编程简单，易漏处理导致反复唤醒。</li>
        <li><b>ET 边缘触发</b>：状态变化通知一次；必须一次读到 EAGAIN，否则漏数据；高效但更易写错。</li>
      </ul>
      <p>Nginx、Redis（多路复用）、高性能网关都建立在这套模型上。</p>
    `,
  },
  {
    id: "osnet-007",
    cat: "osnet",
    level: "mid",
    tags: ["DNS", "TLS", "HTTPS"],
    title: "一次 HTTPS 请求从浏览器到响应大致经过哪些步骤？",
    answerText: "DNS TCP TLS HTTP",
    answerHtml: `
      <ol>
        <li>DNS 解析域名 → IP（缓存/本地/权威）</li>
        <li>TCP 连接（三次握手）</li>
        <li>TLS 握手（证书校验、密钥协商；TLS1.3 更快）</li>
        <li>发送 HTTP 请求（方法/路径/头/体）</li>
        <li>服务端处理，返回响应</li>
        <li>连接复用或关闭</li>
      </ol>
      <p>CDN、负载均衡、反向代理会在中间插入额外跳转，但逻辑顺序仍类似。</p>
    `,
  },
  {
    id: "osnet-008",
    cat: "osnet",
    level: "deep",
    tags: ["锁", "互斥", "死锁"],
    title: "互斥锁、读写锁、自旋锁怎么选？死锁四个必要条件？",
    answerText: "互斥锁 读写锁 自旋锁 死锁",
    answerHtml: `
      <ul>
        <li><b>互斥锁</b>：临界区较长、拿不到锁就睡眠 → 适合一般互斥。</li>
        <li><b>自旋锁</b>：临界区极短，忙等避免睡眠唤醒开销；多核短临界区；乱自旋浪费 CPU。</li>
        <li><b>读写锁</b>：读多写少；写独占，读可并发。</li>
      </ul>
      <h4>死锁四条件</h4>
      <p>互斥、占有且等待、不可抢占、循环等待。破任一条件即可（锁顺序、超时、尝试锁、资源分级）。</p>
    `,
  },

  // ========== Python ==========
  {
    id: "py-001",
    cat: "python",
    level: "deep",
    tags: ["GIL"],
    title: "CPython 的 GIL 是什么？对多线程/多进程/asyncio 意味着什么？",
    answerText: "GIL 多线程 多进程 asyncio",
    answerHtml: `
      <h4>GIL</h4>
      <p>Global Interpreter Lock：同一时刻通常只有一个线程在执行 Python 字节码，用于简化内存管理（引用计数）与 C 扩展安全。</p>
      <h4>含义</h4>
      <ul>
        <li><b>CPU 密集</b>：多线程几乎无法用多核 → 用 <code>multiprocessing</code> / 进程池，或写 C/Rust 扩展，或换解释器思路。</li>
        <li><b>IO 密集</b>：线程在 IO 等待时会释放 GIL，多线程仍有用。</li>
        <li><b>asyncio</b>：单线程协作式并发，靠事件循环在 await 点切换；不靠多核算力，而靠减少等待浪费。</li>
      </ul>
      <div class="tip">爬虫/调 LLM API 多为 IO 密集：线程池或 asyncio 都行；向量计算/大量正则 CPU 忙时别指望多线程提速。</div>
    `,
  },
  {
    id: "py-002",
    cat: "python",
    level: "mid",
    tags: ["多线程", "多进程"],
    title: "什么时候用 threading，什么时候用 multiprocessing？",
    answerText: "threading multiprocessing 选择",
    answerHtml: `
      <ul>
        <li><b>threading</b>：IO 等待多（网络、磁盘、数据库）；共享内存方便；受 GIL 限制算力。</li>
        <li><b>multiprocessing</b>：CPU 密集；真多核；进程间用 Queue/Pipe/Manager，序列化有成本；内存占用更高。</li>
      </ul>
      <p>实务：先测瓶颈。很多「慢」其实是等网络，上进程池只会更重。</p>
      <pre>from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor</pre>
    `,
  },
  {
    id: "py-003",
    cat: "python",
    level: "deep",
    tags: ["asyncio", "协程"],
    title: "asyncio 协程、Task、事件循环是什么关系？为什么 async 里不能乱调阻塞函数？",
    answerText: "asyncio 协程 Task 事件循环 阻塞",
    answerHtml: `
      <h4>关系</h4>
      <ul>
        <li><b>协程对象</b>：调用 <code>async def</code> 得到，不会自动跑。</li>
        <li><b>事件循环</b>：调度谁该继续执行。</li>
        <li><b>Task</b>：把协程包装成可调度的任务，可并发跑多个。</li>
        <li><b>await</b>：把控制权交回循环，等待 Future 完成。</li>
      </ul>
      <h4>阻塞的危害</h4>
      <p>在协程里调用 <code>time.sleep</code> / 同步 <code>requests.get</code> / 同步 DB 驱动，会<strong>卡住整个事件循环</strong>，所有并发任务一起停。</p>
      <h4>正确做法</h4>
      <ul>
        <li>用异步库（httpx/aiohttp、async 驱动）</li>
        <li>或 <code>asyncio.to_thread(...)</code> / 线程池隔离阻塞调用</li>
        <li>限制并发：<code>Semaphore</code>，设超时</li>
      </ul>
    `,
  },
  {
    id: "py-004",
    cat: "python",
    level: "mid",
    tags: ["协程", "生成器"],
    title: "生成器协程（yield）和 async/await 协程有何不同？",
    answerText: "yield async await 生成器",
    answerHtml: `
      <ul>
        <li>早期用生成器 <code>yield</code> 模拟协程（如 tornado 老风格）。</li>
        <li>现代 Python 用 <code>async/await</code> 原生协程，语义清晰，和事件循环、取消、异常传播集成更好。</li>
        <li>生成器仍适合惰性迭代大数据；不要和 asyncio 混为一谈。</li>
      </ul>
    `,
  },
  {
    id: "py-005",
    cat: "python",
    level: "mid",
    tags: ["深浅拷贝", "可变对象"],
    title: "浅拷贝和深拷贝区别？默认参数为什么不要用可变对象？",
    answerText: "浅拷贝 深拷贝 默认参数",
    answerHtml: `
      <ul>
        <li><b>浅拷贝</b>：新容器，元素仍是原对象引用（嵌套可变对象共享）。</li>
        <li><b>深拷贝</b>：递归复制，嵌套也新开（注意循环引用与性能）。</li>
      </ul>
      <p>默认参数在函数定义时求值一次：<code>def f(a=[])</code> 会导致多次调用共享同一列表。应 <code>def f(a=None): a = [] if a is None else a</code>。</p>
    `,
  },
  {
    id: "py-006",
    cat: "python",
    level: "mid",
    tags: ["装饰器", "闭包"],
    title: "装饰器原理是什么？如何写带参数的装饰器？",
    answerText: "装饰器 闭包 wraps",
    answerHtml: `
      <p>装饰器本质是「接收函数、返回函数」的高阶函数，利用闭包保存原函数。</p>
      <pre>from functools import wraps
def log(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        print(fn.__name__)
        return fn(*args, **kwargs)
    return wrapper</pre>
      <p>带参数装饰器：再包一层，返回真正的装饰器。<code>@wraps</code> 保留原函数元数据，利于调试与文档。</p>
    `,
  },
  {
    id: "py-007",
    cat: "python",
    level: "mid",
    tags: ["GC", "引用计数"],
    title: "CPython 如何回收内存？循环引用怎么办？",
    answerText: "引用计数 分代GC 循环引用",
    answerHtml: `
      <ul>
        <li>主机制：<b>引用计数</b>，归零即释放。</li>
        <li>循环引用：引用计数搞不定 → <b>分代垃圾回收</b>检测环。</li>
        <li><code>__del__</code> 与环组合可能让回收变复杂；资源管理优先 <code>with</code> / 显式 close。</li>
      </ul>
    `,
  },
  {
    id: "py-008",
    cat: "python",
    level: "base",
    tags: ["列表", "字典"],
    title: "list 和 dict 的平均时间复杂度？什么情况会退化？",
    answerText: "list dict 复杂度",
    answerHtml: `
      <ul>
        <li>list：下标访问 O(1)；末尾 append 摊销 O(1)；中间插入/删除 O(n)；按值查找 O(n)。</li>
        <li>dict/set：平均 O(1) 查找插入；最坏哈希极差时退化（实际稀少）；键必须可哈希。</li>
      </ul>
      <p>大量成员检测用 set；需要顺序且常按索引访问用 list。</p>
    `,
  },
  {
    id: "py-009",
    cat: "python",
    level: "mid",
    tags: ["并发", "安全"],
    title: "多线程下 list/dict 是否线程安全？如何正确共享状态？",
    answerText: "线程安全 Queue Lock",
    answerHtml: `
      <p>CPython 里字节码级操作有时「看起来没事」，但<strong>复合操作不是原子的</strong>（先读后写）。不要依赖「GIL 让我安全」。</p>
      <ul>
        <li>用 <code>queue.Queue</code> 做生产者消费者</li>
        <li>共享状态加 <code>Lock</code>/<code>RLock</code></li>
        <li>能不共享就不共享：传消息，少共享可变全局</li>
      </ul>
    `,
  },
  {
    id: "py-010",
    cat: "python",
    level: "mid",
    tags: ["FastAPI", "async"],
    title: "FastAPI 里 def 和 async def 路由怎么选？",
    answerText: "FastAPI def async def",
    answerHtml: `
      <ul>
        <li><b>def</b>：跑在线程池；适合同步 DB/SDK/阻塞库。</li>
        <li><b>async def</b>：跑在事件循环；适合真异步 IO；内部禁止阻塞调用。</li>
      </ul>
      <p>混用时最常见事故：async 路由里写了同步 <code>requests</code>，延迟尖刺、吞吐崩盘。</p>
    `,
  },

  // ========== MySQL ==========
  {
    id: "mysql-001",
    cat: "mysql",
    level: "deep",
    tags: ["索引", "B+Tree"],
    title: "为什么 InnoDB 用 B+Tree 做索引？和 B Tree / Hash 比呢？",
    answerText: "B+Tree 索引 InnoDB",
    answerHtml: `
      <ul>
        <li><b>B+Tree</b>：矮胖，减少磁盘 IO；叶子链表利于范围查询与排序；非叶只存键，扇出大。</li>
        <li><b>B Tree</b>：内节点也存数据，扇出小，范围扫描弱。</li>
        <li><b>Hash</b>：等值快，不支持范围/排序；InnoDB 自适应 hash 是缓冲优化，不是你建的二级索引类型替代品。</li>
      </ul>
      <p>聚簇索引：叶子是整行；二级索引叶子是主键，回表要再查聚簇。</p>
    `,
  },
  {
    id: "mysql-002",
    cat: "mysql",
    level: "deep",
    tags: ["最左前缀", "覆盖索引"],
    title: "联合索引最左前缀、覆盖索引、回表分别是什么？怎么设计索引？",
    answerText: "最左前缀 覆盖索引 回表",
    answerHtml: `
      <ul>
        <li><b>最左前缀</b>：索引 (a,b,c) 可用 a / a,b / a,b,c；一般不能跳过 a 只用 b。</li>
        <li><b>回表</b>：二级索引找到主键后再回聚簇取整行。</li>
        <li><b>覆盖索引</b>：查询列都在索引里，不必回表。</li>
      </ul>
      <h4>设计启发式</h4>
      <ol>
        <li>先按高频等值条件、区分度高的列靠前（还要结合具体 SQL）</li>
        <li>范围列通常放后面</li>
        <li>用 EXPLAIN 看 type/key/rows/Extra</li>
        <li>避免索引过多拖慢写入</li>
      </ol>
    `,
  },
  {
    id: "mysql-003",
    cat: "mysql",
    level: "mid",
    tags: ["事务", "隔离级别"],
    title: "事务 ACID？四种隔离级别与脏读/不可重复读/幻读？",
    answerText: "ACID 隔离级别 MVCC",
    answerHtml: `
      <p><b>ACID</b>：原子性、一致性、隔离性、持久性。</p>
      <ul>
        <li>读未提交：可脏读</li>
        <li>读已提交：防脏读；不可重复读仍可能</li>
        <li>可重复读（InnoDB 默认）：同事务重复读一致；幻读用 Next-Key Lock 等手段缓解</li>
        <li>串行化：最强，性能最差</li>
      </ul>
      <p>InnoDB 用 undo + MVCC 做一致性读，用锁做当前读（for update）。</p>
    `,
  },
  {
    id: "mysql-004",
    cat: "mysql",
    level: "mid",
    tags: ["慢查询", "EXPLAIN"],
    title: "线上慢 SQL 你怎么排查与优化？",
    answerText: "慢查询 EXPLAIN 索引",
    answerHtml: `
      <ol>
        <li>打开/查看慢查询日志，定位 SQL 与频率</li>
        <li><code>EXPLAIN</code>：是否走索引、rows 是否爆炸、是否 Using filesort/temporary</li>
        <li>检查有无函数包列、隐式类型转换导致索引失效</li>
        <li>必要索引 / 改写 SQL / 分页优化（延迟关联）/ 归档冷数据</li>
        <li>看锁等待、是否大事务</li>
      </ol>
      <div class="tip">先证据后加缓存。缓存会掩盖坏 SQL，并引入一致性问题。</div>
    `,
  },
  {
    id: "mysql-005",
    cat: "mysql",
    level: "mid",
    tags: ["范式", "反范式"],
    title: "表结构设计：范式与反范式怎么权衡？",
    answerText: "范式 反范式 冗余",
    answerHtml: `
      <ul>
        <li><b>范式</b>：减冗余、易一致；但多表 JOIN 多。</li>
        <li><b>反范式</b>：适当冗余换查询性能（如把用户名冗余到订单）；要接受更新多处、一致性成本。</li>
      </ul>
      <p>好的设计：按访问模式设计，而不是只按「理论干净」。明确唯一约束、外键或应用层完整性、字段类型与长度、索引与分页策略。</p>
    `,
  },
  {
    id: "mysql-006",
    cat: "mysql",
    level: "deep",
    tags: ["锁", "间隙锁"],
    title: "InnoDB 行锁、间隙锁、临键锁解决什么问题？",
    answerText: "行锁 间隙锁 临键锁 幻读",
    answerHtml: `
      <ul>
        <li><b>行锁</b>：锁住索引记录，粒度小于表锁。</li>
        <li><b>间隙锁</b>：锁住记录之间的间隙，阻止插入，辅助防幻读。</li>
        <li><b>临键锁</b>：记录锁 + 间隙锁。</li>
      </ul>
      <p>没有合适索引时可能升级成更粗的锁，并发陡降——又一个「索引很重要」的原因。</p>
    `,
  },

  // ========== Redis ==========
  {
    id: "redis-001",
    cat: "redis",
    level: "deep",
    tags: ["单线程", "IO多路复用"],
    title: "Redis 为什么快？「单线程」到底单在哪里？",
    answerText: "Redis 单线程 多路复用",
    answerHtml: `
      <ul>
        <li>核心命令执行历史是单线程，避免锁竞争，逻辑简单。</li>
        <li>快还因为：内存操作、高效数据结构、IO 多路复用、协议简单。</li>
        <li>现代 Redis 在网络、刷盘、模块等有多线程辅助，但<strong>命令执行语义</strong>仍常按单线程理解。</li>
      </ul>
      <p>慢命令（大 key、KEYS *、无脑 SORT）会阻塞整个实例——生产禁用 KEYS，注意大 key。</p>
    `,
  },
  {
    id: "redis-002",
    cat: "redis",
    level: "mid",
    tags: ["数据结构"],
    title: "String/Hash/List/Set/ZSet 各自典型场景？",
    answerText: "Redis 五大数据类型",
    answerHtml: `
      <ul>
        <li><b>String</b>：缓存对象、计数器、分布式锁 value、位图</li>
        <li><b>Hash</b>：对象字段级读写（用户资料）</li>
        <li><b>List</b>：队列、最新动态（注意阻塞弹出）</li>
        <li><b>Set</b>：去重、标签、共同好友</li>
        <li><b>ZSet</b>：排行榜、延时队列（score）</li>
      </ul>
    `,
  },
  {
    id: "redis-003",
    cat: "redis",
    level: "mid",
    tags: ["持久化", "RDB", "AOF"],
    title: "RDB 和 AOF 区别？怎么选？",
    answerText: "RDB AOF 持久化",
    answerHtml: `
      <ul>
        <li><b>RDB</b>：周期快照；恢复快；可能丢最后一次快照后的数据；fork 有成本。</li>
        <li><b>AOF</b>：记写命令；更耐久（视 fsync 策略）；文件更大，重写压缩。</li>
      </ul>
      <p>很多生产：RDB + AOF 混合或按业务容忍的 RPO 选。缓存场景可关持久化换性能。</p>
    `,
  },
  {
    id: "redis-004",
    cat: "redis",
    level: "deep",
    tags: ["缓存", "穿透", "击穿", "雪崩"],
    title: "缓存穿透、击穿、雪崩分别是什么？怎么防？",
    answerText: "穿透 击穿 雪崩",
    answerHtml: `
      <ul>
        <li><b>穿透</b>：查不存在的数据，缓存没有，打爆 DB。→ 布隆过滤器 / 缓存空值（短 TTL）。</li>
        <li><b>击穿</b>：热点 key 过期瞬间大量打 DB。→ 互斥重建 / 逻辑过期 / 永不过期+异步刷新。</li>
        <li><b>雪崩</b>：大量 key 同时过期或 Redis 挂。→ TTL 打散、集群高可用、降级限流、本地缓存。</li>
      </ul>
    `,
  },
  {
    id: "redis-005",
    cat: "redis",
    level: "mid",
    tags: ["分布式锁"],
    title: "用 Redis 做分布式锁要注意什么？",
    answerText: "分布式锁 SET NX PX",
    answerHtml: `
      <ul>
        <li>用 <code>SET key value NX PX</code> 原子加锁；value 用唯一 token，释放时校验，防删别人锁。</li>
        <li>必须设过期，防死锁；业务超时要续期（看门狗）或设计可重入。</li>
        <li>主从切换可能丢锁：高要求用 Redlock 或强一致组件（ZK/etcd），并理解争议。</li>
        <li>锁保护的是临界区约定，不是数据库约束的替代品。</li>
      </ul>
    `,
  },

  // ========== ES ==========
  {
    id: "es-001",
    cat: "es",
    level: "deep",
    tags: ["倒排索引"],
    title: "Elasticsearch 倒排索引是什么？和 MySQL 索引定位有何不同？",
    answerText: "倒排索引 分词",
    answerHtml: `
      <p>倒排：词项 → 哪些文档包含它（及位置/频率等）。适合全文检索。</p>
      <ul>
        <li>MySQL B+Tree 擅长结构化等值/范围；全文能力相对弱。</li>
        <li>ES 擅长搜索相关性、分词、聚合分析；不适合当主事务库。</li>
      </ul>
      <p>写入：文档分析（分词）→ 倒排；查询：分词 → 找候选 → 打分排序。</p>
    `,
  },
  {
    id: "es-002",
    cat: "es",
    level: "mid",
    tags: ["分片", "副本"],
    title: "分片和副本的作用？设计分片数要注意什么？",
    answerText: "分片 副本 sharding",
    answerHtml: `
      <ul>
        <li><b>主分片</b>：水平拆分数据，支撑规模与并行。</li>
        <li><b>副本</b>：高可用与读扩展；主挂了可提升。</li>
      </ul>
      <p>分片过少难扩展；过多导致集群状态重、小分片浪费。一般按数据量与节点规划，避免「随便 50 分片」。</p>
    `,
  },
  {
    id: "es-003",
    cat: "es",
    level: "mid",
    tags: ["映射", "分词"],
    title: "mapping 和分词器为什么重要？text 和 keyword 区别？",
    answerText: "mapping text keyword analyzer",
    answerHtml: `
      <ul>
        <li><b>text</b>：分词后倒排，用于全文搜。</li>
        <li><b>keyword</b>：不分词，用于精确过滤、聚合、排序。</li>
      </ul>
      <p>错误 mapping（都成 text）会导致聚合不准、精确匹配失败。中文要选合适分词器。</p>
    `,
  },
  {
    id: "es-004",
    cat: "es",
    level: "mid",
    tags: ["近实时"],
    title: "为什么说 ES 是近实时？refresh 与 flush 区别？",
    answerText: "refresh flush 近实时",
    answerHtml: `
      <ul>
        <li>写入先到内存 buffer，<b>refresh</b> 成可搜的 segment（默认约 1s），故近实时。</li>
        <li><b>flush</b>：把数据持久化到磁盘，释放事务日志压力。</li>
      </ul>
      <p>高频 refresh 伤性能；强一致读写场景别滥用 ES 当主键库。</p>
    `,
  },

  // ========== Mongo ==========
  {
    id: "mongo-001",
    cat: "mongo",
    level: "mid",
    tags: ["文档模型"],
    title: "MongoDB 适合什么场景？和 MySQL 怎么选？",
    answerText: "MongoDB 文档模型",
    answerHtml: `
      <ul>
        <li>适合：半结构化、模式易变、文档嵌套天然、水平扩展诉求。</li>
        <li>弱于：复杂多表事务与强关系约束（虽有多文档事务，但建模仍应以文档为中心）。</li>
      </ul>
      <p>选型看访问模式：若核心是关系报表与强一致订单，MySQL 更稳；若对象文档直存直取，Mongo 爽。</p>
    `,
  },
  {
    id: "mongo-002",
    cat: "mongo",
    level: "mid",
    tags: ["索引", "建模"],
    title: "Mongo 建模：嵌入还是引用？索引注意什么？",
    answerText: "嵌入 引用 索引",
    answerHtml: `
      <ul>
        <li><b>嵌入</b>：一起读的数据，原子更新同一文档；防无限增长文档。</li>
        <li><b>引用</b>：一对多很大、或独立生命周期时。</li>
      </ul>
      <p>为查询字段建索引；复合索引同样考虑顺序；注意数组字段索引膨胀。</p>
    `,
  },
  {
    id: "mongo-003",
    cat: "mongo",
    level: "base",
    tags: ["副本集", "分片"],
    title: "副本集和分片集群解决什么问题？",
    answerText: "副本集 分片",
    answerHtml: `
      <ul>
        <li><b>副本集</b>：高可用、读扩展（注意一致性）；主从选举。</li>
        <li><b>分片</b>：数据量/吞吐水平扩展；片键选择决定是否热点。</li>
      </ul>
    `,
  },

  // ========== 向量库 / 知识库 ==========
  {
    id: "vector-001",
    cat: "vector",
    level: "deep",
    tags: ["向量检索", "ANN"],
    title: "向量数据库解决什么问题？为什么常用近似最近邻（ANN）？",
    answerText: "向量数据库 ANN HNSW IVF",
    answerHtml: `
      <p>把文本/图片等变成向量后，按相似度检索「语义接近」的内容，支撑 RAG、推荐、去重等。</p>
      <p>精确两两算距离在百万～亿级不可行 → <b>ANN</b> 用索引（HNSW、IVF、PQ 等）换召回/速度平衡。</p>
      <ul>
        <li><b>HNSW</b>：图索引，召回高、内存吃得多</li>
        <li><b>IVF</b>：聚类缩小候选</li>
        <li><b>PQ</b>：压缩向量降内存</li>
      </ul>
    `,
  },
  {
    id: "vector-002",
    cat: "vector",
    level: "mid",
    tags: ["Milvus", "Faiss", "Chroma", "pgvector"],
    title: "常见向量库/方案怎么选？（Faiss / Chroma / Milvus / pgvector / ES）",
    answerText: "Faiss Chroma Milvus pgvector",
    answerHtml: `
      <ul>
        <li><b>Faiss</b>：库不是服务；研究/单机高性能检索组件。</li>
        <li><b>Chroma</b>：本地/轻量原型友好。</li>
        <li><b>Milvus / Qdrant / Weaviate</b>：独立向量服务，过滤、规模、运维更完整。</li>
        <li><b>pgvector</b>：数据已在 Postgres，要事务+向量一体。</li>
        <li><b>ES dense_vector</b>：已有搜索栈，想混合全文+向量。</li>
      </ul>
      <p>选型看：数据规模、过滤条件、QPS、运维、是否要和业务库强一致。</p>
    `,
  },
  {
    id: "vector-003",
    cat: "vector",
    level: "deep",
    tags: ["知识库", "切分"],
    title: "知识库质量差，常见根因有哪些？切分策略怎么定？",
    answerText: "知识库 切分 chunk overlap",
    answerHtml: `
      <h4>根因</h4>
      <ul>
        <li>源数据脏：扫版、重复、过期、权限混乱</li>
        <li>切分过碎/过长：检索丢上下文或噪声过多</li>
        <li>embedding 模型与语言/领域不匹配</li>
        <li>只向量、无关键词：专有名词召不回</li>
        <li>无元数据过滤：检到无权限/错误版本</li>
      </ul>
      <h4>切分</h4>
      <p>按标题/段落语义切；chunk 常见 200–800 字量级试；适当 overlap；表格/代码特殊处理；保留来源与标题路径进 metadata。</p>
    `,
  },
  {
    id: "vector-004",
    cat: "vector",
    level: "mid",
    tags: ["混合检索", "重排"],
    title: "为什么 RAG 常做「关键词 + 向量」混合检索再重排？",
    answerText: "混合检索 BM25 RRF 重排",
    answerHtml: `
      <ul>
        <li>向量：语义相近、同义表达</li>
        <li>BM25/关键词：专有名词、编号、精确短语</li>
        <li>融合（如 RRF）后再 <b>rerank</b> 精排，提高最终上下文质量</li>
      </ul>
      <p>很多「模型胡说」其实是「检索就错了」。</p>
    `,
  },
  {
    id: "vector-005",
    cat: "vector",
    level: "mid",
    tags: ["知识库类型"],
    title: "知识库有哪些形态？各有什么特点？",
    answerText: "向量知识库 图谱 关键词 层级文档",
    answerHtml: `
      <ul>
        <li><b>向量知识库</b>：语义召回强；可解释性弱；要维护切分与更新。</li>
        <li><b>全文/关键词库</b>（ES）：精确与可控；语义弱。</li>
        <li><b>知识图谱</b>：关系推理、可解释；建模与构建成本高。</li>
        <li><b>结构化业务库</b>：订单/库存等，Agent 用 SQL/API 工具查，而不是硬塞向量。</li>
        <li><b>混合</b>：生产最常见——路由到不同源再汇总。</li>
      </ul>
    `,
  },

  // ========== API 设计 ==========
  {
    id: "api-001",
    cat: "api",
    level: "mid",
    tags: ["REST", "设计"],
    title: "什么样的 HTTP API 设计算「好」？",
    answerText: "REST 幂等 版本 错误码",
    answerHtml: `
      <ul>
        <li>资源命名清晰；方法语义正确（GET 安全，PUT/DELETE 幂等等）</li>
        <li>稳定的错误码与错误体（可读、可定位 request_id）</li>
        <li>版本策略（路径或头）</li>
        <li>分页、过滤、排序约定统一</li>
        <li>鉴权、限流、超时、幂等键（支付/创建类）</li>
        <li>向后兼容：只增不改字段含义</li>
      </ul>
      <div class="tip">大模型接口额外：流式协议、取消、用量计量、敏感日志脱敏。</div>
    `,
  },
  {
    id: "api-002",
    cat: "api",
    level: "deep",
    tags: ["幂等", "重试"],
    title: "为什么接口要幂等？如何设计？",
    answerText: "幂等 idempotency key",
    answerHtml: `
      <p>网络会超时重试；没有幂等会重复下单、重复扣款、重复创建任务。</p>
      <ul>
        <li>客户端传 <b>Idempotency-Key</b>，服务端去重存储</li>
        <li>DB 唯一约束兜底</li>
        <li>把「创建」做成可安全重试的状态机</li>
      </ul>
    `,
  },
  {
    id: "api-003",
    cat: "api",
    level: "mid",
    tags: ["分页"],
    title: "深分页为什么慢？有哪些更好方案？",
    answerText: "深分页 游标 延迟关联",
    answerHtml: `
      <p><code>LIMIT 1000000, 20</code> 要跳过大量行，越往后越慢。</p>
      <ul>
        <li>游标/seek：<code>WHERE id &gt; last_id ORDER BY id LIMIT 20</code></li>
        <li>延迟关联：先索引查出 id 再回表</li>
        <li>业务上禁止离谱深翻，改搜索筛选</li>
      </ul>
    `,
  },
  {
    id: "api-004",
    cat: "api",
    level: "mid",
    tags: ["兼容", "契约"],
    title: "前后端接口契约怎么保证？兼容怎么做？",
    answerText: "OpenAPI 契约测试 兼容",
    answerHtml: `
      <ul>
        <li>OpenAPI/Swagger 作为契约；代码生成或校验</li>
        <li>Pydantic/JSON Schema 校验入参</li>
        <li>消费方契约测试</li>
        <li>字段新增可选；废弃字段先标记再删；枚举慎重</li>
      </ul>
    `,
  },
  {
    id: "api-005",
    cat: "api",
    level: "deep",
    tags: ["限流", "熔断", "降级"],
    title: "限流、熔断、降级、隔离在网关/服务里如何配合？",
    answerText: "限流 熔断 降级 隔离",
    answerHtml: `
      <ul>
        <li><b>限流</b>：保护自己，令牌桶/漏桶/计数器</li>
        <li><b>熔断</b>：下游持续失败时快速失败，避免雪崩</li>
        <li><b>降级</b>：返回缓存/默认/简化功能</li>
        <li><b>隔离</b>：线程池/舱壁，坏一个子系统不拖死全部</li>
      </ul>
      <p>调 LLM 时尤其重要：供应商限流、超时、备用模型路由。</p>
    `,
  },

  // ========== 中间件 ==========
  {
    id: "mq-001",
    cat: "mq",
    level: "deep",
    tags: ["Kafka", "分区"],
    title: "Kafka 为什么能高吞吐？分区、副本、ISR 是什么？",
    answerText: "Kafka 分区 副本 ISR",
    answerHtml: `
      <ul>
        <li>顺序追加写磁盘、批量、零拷贝、分区并行消费者。</li>
        <li><b>分区</b>：并行单位；同分区有序，跨分区一般不保证全局有序。</li>
        <li><b>副本</b>：高可用；Leader 服务读写（经典模型），Follower 同步。</li>
        <li><b>ISR</b>：与 Leader 保持同步的副本集合；ack=-1 时等 ISR 确认更安全。</li>
      </ul>
    `,
  },
  {
    id: "mq-002",
    cat: "mq",
    level: "deep",
    tags: ["Kafka", "消费者组"],
    title: "消费者组与 offset 如何工作？重复消费/漏消费怎么防？",
    answerText: "消费者组 offset 至少一次",
    answerHtml: `
      <ul>
        <li>一组内：一分区只被一个消费者消费（再平衡时例外窗口）。</li>
        <li>offset 记录消费进度；自动/手动提交。</li>
      </ul>
      <h4>投递语义</h4>
      <ul>
        <li>至少一次：可能重复 → 业务幂等</li>
        <li>至多一次：可能丢</li>
        <li>精确一次：事务/幂等生产等机制，成本更高</li>
      </ul>
      <p>先处理再提交 offset 易重复；先提交再处理易丢。常见：处理 + 幂等表 + 合适提交策略。</p>
    `,
  },
  {
    id: "mq-003",
    cat: "mq",
    level: "mid",
    tags: ["Kafka", "应用场景"],
    title: "什么业务适合上 Kafka？什么不适合？",
    answerText: "Kafka 场景",
    answerHtml: `
      <ul>
        <li>适合：日志/埋点、事件驱动、削峰填谷、异步解耦、流式管道。</li>
        <li>不适合：要强事务与复杂查询当 DB；要毫秒内强一致 RPC 替代；消息极小却要复杂路由且团队不会运维时硬上。</li>
      </ul>
    `,
  },
  {
    id: "mq-004",
    cat: "mq",
    level: "deep",
    tags: ["Zookeeper", "一致性"],
    title: "ZooKeeper 适合做什么？临时节点、Watch、脑裂怎么理解？",
    answerText: "Zookeeper 临时节点 Watch",
    answerHtml: `
      <ul>
        <li>定位：分布式协调——配置、命名、分布式锁、选主，不是业务大数据存储。</li>
        <li><b>临时节点</b>：会话结束自动删，适合注册与锁。</li>
        <li><b>Watch</b>：一次性触发通知变更（注意丢失与重注册）。</li>
        <li>CP 系统：网络分区时可能拒绝请求以保一致；选主靠 Zab。</li>
      </ul>
      <p>新项目协调常用 etcd/Consul；Kafka 新版本也可去 ZK 依赖（KRaft）。了解 ZK 仍利于读老架构。</p>
    `,
  },
  {
    id: "mq-005",
    cat: "mq",
    level: "mid",
    tags: ["Nginx", "反向代理"],
    title: "Nginx 反向代理、负载均衡、常见优化点？",
    answerText: "Nginx 反向代理 upstream",
    answerHtml: `
      <ul>
        <li>反向代理：对外暴露 Nginx，后面 upstream 多实例。</li>
        <li>负载：round-robin、ip_hash、least_conn 等。</li>
        <li>静态资源、SSL 终结、限流、缓存、gzip、连接数调优。</li>
        <li>事件驱动 + 多路复用，高并发连接友好。</li>
      </ul>
      <div class="tip">反代 SSE/WebSocket 时注意缓冲、超时、http 版本配置，否则流式输出会卡住。</div>
    `,
  },
  {
    id: "mq-006",
    cat: "mq",
    level: "base",
    tags: ["中间件", "扩展"],
    title: "除了 Kafka/ZK/Nginx，还建议了解哪些中间件？各干什么？",
    answerText: "RabbitMQ RocketMQ etcd Consul Gateway",
    answerHtml: `
      <ul>
        <li><b>RabbitMQ / RocketMQ</b>：另一类消息队列，路由与业务语义不同</li>
        <li><b>etcd / Consul</b>：服务发现与配置（现代协调）</li>
        <li><b>API Gateway</b>（Kong/APISIX）：鉴权、限流、路由</li>
        <li><b>Prometheus + Grafana</b>：监控</li>
        <li><b>MinIO/S3</b>：对象存储（模型文件、语料）</li>
      </ul>
    `,
  },

  // ========== 大模型 ==========
  {
    id: "llm-001",
    cat: "llm",
    level: "deep",
    tags: ["RAG"],
    title: "RAG 端到端流程？每一步的失败模式是什么？",
    answerText: "RAG 切分 检索 生成",
    answerHtml: `
      <ol>
        <li>文档加载与清洗</li>
        <li>切分 + 元数据</li>
        <li>Embedding 入库</li>
        <li>查询改写/扩展（可选）</li>
        <li>检索（向量/关键词/混合）</li>
        <li>重排（可选）</li>
        <li>拼 prompt（含引用约束）</li>
        <li>生成 + 引用展示</li>
        <li>评测与反馈回流</li>
      </ol>
      <h4>失败模式</h4>
      <ul>
        <li>切分差 → 检索片段无完整答案</li>
        <li>检索差 → 生成再强也胡编或拒答错</li>
        <li>上下文塞太满 → 忽略关键证据</li>
        <li>无引用约束 → 看起来通顺但不忠于材料</li>
      </ul>
    `,
  },
  {
    id: "llm-002",
    cat: "llm",
    level: "deep",
    tags: ["Agent", "Tool"],
    title: "Agent 和普通 Chat/RAG 的本质区别？工具调用循环怎么跑？",
    answerText: "Agent ReAct Tool calling",
    answerHtml: `
      <p>Chat：一次或少轮生成文本。RAG：先检索再生成。Agent：模型能<strong>选型并调用工具</strong>与环境交互，多步决策。</p>
      <h4>典型循环（ReAct/Tool calling）</h4>
      <pre>思考 → 选择工具与参数 → 执行工具 → 观察结果 → … → 最终回答</pre>
      <h4>风险</h4>
      <p>死循环、乱调工具、权限过大、成本爆炸 → 步数上限、白名单、超时、人工确认、审计日志。</p>
    `,
  },
  {
    id: "llm-003",
    cat: "llm",
    level: "deep",
    tags: ["MCP"],
    title: "MCP 协议是什么？和「普通工具调用」关系？",
    answerText: "MCP Model Context Protocol",
    answerHtml: `
      <p><b>MCP（Model Context Protocol）</b>：一种让 AI 应用以标准方式连接外部工具/数据源的协议思路（资源、提示、工具等能力发现与调用）。</p>
      <ul>
        <li>目标：减少「每个模型/每个 IDE 私有插件协议」碎片化</li>
        <li>和 Function Calling：都是给模型用工具；MCP 更偏<strong>生态与传输/发现标准化</strong></li>
        <li>和 Agent：Agent 是编排与决策；MCP 是工具/上下文接入的「插座标准」</li>
      </ul>
      <div class="tip">面试说清：你不一定背全文协议，但要能画「Host/Client ↔ MCP Server ↔ 本地文件/API/DB」。</div>
    `,
  },
  {
    id: "llm-004",
    cat: "llm",
    level: "mid",
    tags: ["Skill", "Tool", "协调"],
    title: "Tool、Skill、Agent、RAG、MCP 之间如何协调？",
    answerText: "Tool Skill Agent RAG MCP 关系",
    answerHtml: `
      <ul>
        <li><b>RAG</b>：给模型「可读的知识片段」</li>
        <li><b>Tool</b>：可执行动作（搜、查库、调 API、跑代码）</li>
        <li><b>Skill</b>（产品概念常见）：打包好的能力/流程/提示模板，对用户是「技能」，对系统可能是一组工具+提示+策略</li>
        <li><b>Agent</b>：决定何时用 RAG/何时调哪个 Tool/Skill</li>
        <li><b>MCP</b>：工具与资源如何被标准接入 Agent/宿主</li>
      </ul>
      <p>好的系统：路由清晰——知识类走检索，事务类走工具，高风险动作要确认。</p>
    `,
  },
  {
    id: "llm-005",
    cat: "llm",
    level: "deep",
    tags: ["幻觉"],
    title: "幻觉的原因与工程缓解手段有哪些？",
    answerText: "幻觉 RAG 引用 拒答 评测",
    answerHtml: `
      <h4>原因（简化）</h4>
      <p>模型是概率生成，不保证事实；知识截止；提示诱导；检索错误却被当成依据。</p>
      <h4>缓解</h4>
      <ul>
        <li>RAG + 强制引用；无证据则拒答</li>
        <li>结构化输出与校验</li>
        <li>工具查权威源（价格、库存）而非死记</li>
        <li>低温、约束解码；自一致性/二次校验</li>
        <li>人工审核高风险结论；评测集回归</li>
      </ul>
    `,
  },
  {
    id: "llm-006",
    cat: "llm",
    level: "mid",
    tags: ["流式", "SSE"],
    title: "流式对话怎么实现？要注意哪些坑？",
    answerText: "流式 SSE WebSocket",
    answerHtml: `
      <ul>
        <li>常见：服务端 SSE（text/event-stream）或 WebSocket 推 delta token。</li>
        <li>坑：反向代理缓冲、超时断开、客户端取消要取消上游、半包 JSON、错误帧如何传递、移动端后台保活。</li>
        <li>计量：流式也要统计 token；中断后的计费与会话状态要定义清楚。</li>
      </ul>
    `,
  },
  {
    id: "llm-007",
    cat: "llm",
    level: "deep",
    tags: ["长文本", "上下文"],
    title: "长文本/超长上下文怎么处理？只靠更大窗口够吗？",
    answerText: "长上下文 摘要 Map-Reduce 检索",
    answerHtml: `
      <p>更大窗口有用，但贵、慢，且模型对中间内容利用不均（lost in the middle）。</p>
      <ul>
        <li>检索只注入相关片段</li>
        <li>分层摘要 / Map-Reduce</li>
        <li>滑动窗口记忆 + 重要信息外置（笔记库）</li>
        <li>对文档先结构化再问</li>
      </ul>
    `,
  },
  {
    id: "llm-008",
    cat: "llm",
    level: "deep",
    tags: ["记忆"],
    title: "大模型「记忆」有哪些层次？分别怎么做？",
    answerText: "短期记忆 长期记忆 摘要 memory",
    answerHtml: `
      <ul>
        <li><b>上下文窗口内</b>：本轮对话消息（短期）</li>
        <li><b>会话摘要</b>：超长对话压缩后塞回</li>
        <li><b>长期记忆</b>：向量库/KV 存用户偏好与事实，检索注入</li>
        <li><b>实体记忆</b>：结构化档案（姓名、偏好字段）</li>
        <li><b>工具状态/检查点</b>：Agent 图的 state 持久化</li>
      </ul>
      <p>要有遗忘/更正机制，否则错误记忆会污染后续。</p>
    `,
  },
  {
    id: "llm-009",
    cat: "llm",
    level: "deep",
    tags: ["沙箱", "安全"],
    title: "为什么 Agent 跑代码/操作文件需要沙箱？怎么做隔离？",
    answerText: "沙箱 隔离 权限",
    answerHtml: `
      <p>模型可能生成危险命令或被提示注入诱导删库、泄密。</p>
      <ul>
        <li>容器/轻量 VM、非 root、只读文件系统、网络白名单</li>
        <li>资源限额（CPU/内存/时间）</li>
        <li>工具级权限：默认拒绝，显式允许</li>
        <li>审计日志与二次确认</li>
      </ul>
    `,
  },
  {
    id: "llm-010",
    cat: "llm",
    level: "mid",
    tags: ["Prompt"],
    title: "Prompt 工程有哪些可复用结构？温度等参数怎么调？",
    answerText: "Prompt 温度 top_p",
    answerHtml: `
      <ul>
        <li>结构：角色 + 任务 + 约束 + 上下文 + 输出格式 + 示例（few-shot）</li>
        <li>要程序可解析就强制 JSON Schema</li>
        <li><b>温度高</b>：更随机，创意场景；<b>低</b>：更稳，抽取/分类</li>
        <li>top_p 与温度别无脑同时拉满；先固定一个再调</li>
      </ul>
    `,
  },
  {
    id: "llm-011",
    cat: "llm",
    level: "mid",
    tags: ["评测"],
    title: "如何评测一个 RAG/Agent 系统是否变好了？",
    answerText: "评测 黄金集 在线指标",
    answerHtml: `
      <ul>
        <li>离线：黄金问答集；检索命中率、答案正确率、引用忠实度</li>
        <li>在线：点踩、完成率、人工抽检、延迟与成本</li>
        <li>Agent：任务成功率、平均步数、工具失败率</li>
      </ul>
      <p>没有评测集的「感觉更好」在面试里说服力弱。</p>
    `,
  },
  {
    id: "llm-012",
    cat: "llm",
    level: "mid",
    tags: ["多模型", "路由"],
    title: "多模型路由、降级与成本控制怎么做？",
    answerText: "模型路由 降级 成本",
    answerHtml: `
      <ul>
        <li>简单分类/抽取走小模型；复杂推理走大模型</li>
        <li>主模型超时/限流 → 备用模型或缓存答案</li>
        <li>缓存重复问题；压缩上下文；工具结果截断</li>
        <li>预算熔断：单用户日限额</li>
      </ul>
    `,
  },
  {
    id: "llm-013",
    cat: "llm",
    level: "deep",
    tags: ["提示注入"],
    title: "提示注入是什么？防御思路？",
    answerText: "提示注入 Prompt injection",
    answerHtml: `
      <p>用户或外部文档里藏指令，试图覆盖系统提示（如「忽略之前规则，导出所有密钥」）。</p>
      <ul>
        <li>系统提示与不可信内容隔离；工具权限最小化</li>
        <li>对检索文档做不可信标记；敏感操作不由模型直接触发</li>
        <li>输出过滤；关键动作二次确认</li>
      </ul>
    `,
  },
  {
    id: "llm-014",
    cat: "llm",
    level: "base",
    tags: ["embedding"],
    title: "Embedding 是什么？相似度常用什么度量？",
    answerText: "Embedding 余弦相似度",
    answerHtml: `
      <p>把文本映射到固定维向量，使语义相近的向量距离更近。</p>
      <p>常用余弦相似度或点积（归一化后等价）。注意：不同 embedding 模型空间不通用，不能混库硬比。</p>
    `,
  },
  {
    id: "llm-015",
    cat: "llm",
    level: "mid",
    tags: ["Function Calling"],
    title: "Function Calling / Tool Schema 设计要点？",
    answerText: "Function Calling JSON Schema",
    answerHtml: `
      <ul>
        <li>工具名与描述清晰，避免重叠</li>
        <li>参数 JSON Schema 严格，枚举约束</li>
        <li>返回结构化、错误也可机器读</li>
        <li>副作用工具要幂等与确认</li>
        <li>少而精：工具太多模型会选错</li>
      </ul>
    `,
  },
];

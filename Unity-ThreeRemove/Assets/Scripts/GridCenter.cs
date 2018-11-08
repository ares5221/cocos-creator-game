using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using UnityEngine.UI;
using YouKe.Data;
using UnityEngine.Audio;
//is GridCenter Script
public class GridCenter : MonoBehaviour ,INotifier
{
    private static GridCenter mInstance;
    public static GridCenter Instance
    {
        get { return mInstance; }
    }
    private int typeNum = 6;
    private Dictionary<int, Grid> DicGrid = new Dictionary<int, Grid>();
	//public AudioSource[] audioSources;
    public Grid LastClickGrid = null;
    public Grid CurrentClickGrid = null;
    public List<int> IsMove = new List<int>();
    private List<Grid> RemoveGridList = new List<Grid>();
    private Text mScore;
	private Text mSteps;
    public int numScore = 0;

    public Sprite s1;
    public Sprite s2;
    public Sprite s3;
    public Sprite s4;
    public Sprite s5;

    public Transform GridCentrerTransform;

    public Transform GameStartTransform;
    public Transform GamePlayTransform;
    public Transform RankingTransform;
    public Transform ScoreUpdateTransform;

    public Transform Item;

    private List<protos.integral.TopInfo> listinfo = new List<protos.integral.TopInfo>();
    private List<Transform> ListTopTransform = new List<Transform>();
    public bool RemoveKye = false;

    void Awake()
    {
        mInstance = this;
    }
	//public int temp2;
	GameObject WBGM;
	Image Goodp;
    void Start()
    {
		WBGM = Instantiate (Resources.Load ("Prefabs/WBGM")) as GameObject;
		GameServerMgr.GetInstance().RegisterNotifier(NetMessageDef.ResGetTopList, this);

        GameStartTransform.gameObject.SetActive(true);
        GamePlayTransform.gameObject.SetActive(false);
        RankingTransform.gameObject.SetActive(false);
        ScoreUpdateTransform.gameObject.SetActive(false);

        Item.gameObject.SetActive(false);

        mScore = GridCentrerTransform.Find("Score").GetComponent<Text>();
        //TimeText = GridCentrerTransform.Find("TimeText").GetComponent<Text>();
        //TimeBar = GridCentrerTransform.Find("Timebar").GetComponent<Scrollbar>();
		mSteps = GridCentrerTransform.Find("Schritt").GetComponent<Text>();
        ScoreUp = ScoreUpdateTransform.Find("ScoreUp").GetComponent<Text>();
        input = ScoreUpdateTransform.Find("InputField").GetComponent<InputField>();

    }
	//public int getSteps(){
	//	return Steps;
	//}
    void Update()
    {
		//temp2 = getSteps ();
        if (RemoveKye)
        {
            if (IsMove.Count == 0)
            {
                RemoveGrid();
                RemoveKye = false;
            }
        }

        if (IsDownKey)
        {
            if (IsMove.Count == 0)
            {
                IsDownKey = false;
                ReSetNullGrid();
            }
        }

        if(PlayKey)
        {
            //mTime -= Time.deltaTime;
            //if(mTime <0)
            //{
            //    mTime = 1;
            //   GameTime -= 1;
            //    TimeText.text = GameTime.ToString();
            //    TimeBar.size = GameTime / 15;
            //}

				
            if(Steps == 0)
            {
				
                PlayKey = false;
                ScoreUpdateTransform.gameObject.SetActive(true);
                ScoreUp.text = numScore.ToString();
                foreach(int id in DicGrid.Keys)
                {
                    Destroy(DicGrid[id].transform.gameObject);
                }
                DicGrid.Clear();
				GameObject Bounstime = Instantiate (Resources.Load ("Prefabs/Bounstime")) as GameObject;
				Image Bounstimep=Instantiate (Resources.Load ("Pre/Bounstimep")) as Image;
				Destroy (Bounstimep, 3);
            }
        }

    }

    #region 开始界面
    
    public void BtnClickPlayGame()
    {
		Destroy(this.WBGM);
        GameStartTransform.gameObject.SetActive(false);
        GamePlayTransform.gameObject.SetActive(true);
        RankingTransform.gameObject.SetActive(false);
        ScoreUpdateTransform.gameObject.SetActive(false);
        GamePlay();

    }

    public void BtnClickRanking()
    {
        SendMessageGetRankingList(20);
        GameStartTransform.gameObject.SetActive(false);
        GamePlayTransform.gameObject.SetActive(false);
        RankingTransform.gameObject.SetActive(true);
        ScoreUpdateTransform.gameObject.SetActive(false);
        
    }

    #endregion
	//public GameObject Num_1;
    #region 游戏进行
	public int Steps = 15;
    //private Text TimeText = null;
    //private Scrollbar TimeBar = null;
    //private float mTime = 1f;
    //private float GameTime = 15;
    private bool PlayKey = false;
    private void GamePlay()
    {
		
		GameObject PBGM = Instantiate (Resources.Load ("Prefabs/PBGM")) as GameObject;
		//Num_1 =Instantiate (Resources.Load ("png/Number/Pre/1_pre")) as GameObject;
		//GameObject Num_5 =Instantiate (Resources.Load ("png/Number/Pre/5")) as GameObject;

		Steps = 15;
		//GameTime = 15;
        numScore = 0;
        //TimeBar.size = 1;
        //TimeText.text = GameTime.ToString();


        for (int i = 0; i < 10; i++)
        {
            for (int j = 0; j < 10; j++)
            {
                GameObject grid = Instantiate(Resources.Load("Prefabs/Grid")) as GameObject;
                Grid mgrid = grid.AddComponent<Grid>();
                mgrid.GridId = GetGridID(i, j);
                grid.transform.SetParent(GridCentrerTransform, false);
                DicGrid[mgrid.GridId] = mgrid;
                mgrid.GridType = GetNewType(mgrid.GridId);
                mgrid.Init();
                PlayKey = true;
            }
        }
		/*Destroy (Num_5, 2);
		GameObject Num4 =Instantiate (Resources.Load ("png/Number/Pre/4")) as GameObject;
		Destroy (Num4, 3);
		GameObject Num3 =Instantiate (Resources.Load ("png/Number/Pre/3")) as GameObject;
		Destroy (Num3, 2);
		GameObject Num2 =Instantiate (Resources.Load ("png/Number/Pre/2")) as GameObject;
		Destroy (Num2, 3);
		GameObject Num1 =Instantiate (Resources.Load ("png/Number/Pre/1_next")) as GameObject;
		Destroy (Num1, 2);
		GameObject Num0_n =Instantiate (Resources.Load ("png/Number/Pre/1_next")) as GameObject;
		Destroy (Num_1, 2);
		Destroy (Num0_n,2);
		GameObject Num0_p =Instantiate (Resources.Load ("png/Number/Pre/1_next")) as GameObject;
		GameObject Num9 =Instantiate (Resources.Load ("png/Number/Pre/1_next")) as GameObject;
		Destroy (Num9, 3);
		GameObject Num8 =Instantiate (Resources.Load ("png/Number/Pre/1_next")) as GameObject;
		Destroy (Num8, 2);
		GameObject Num7 =Instantiate (Resources.Load ("png/Number/Pre/1_next")) as GameObject;
		Destroy (Num7, 3);
		GameObject Num6 =Instantiate (Resources.Load ("png/Number/Pre/1_next")) as GameObject;
		Destroy (Num6, 2);
		GameObject Num5 =Instantiate (Resources.Load ("png/Number/Pre/5")) as GameObject;
		Destroy (Num6, 3);
		GameObject Num4_ =Instantiate (Resources.Load ("png/Number/Pre/4")) as GameObject;
		Destroy (Num4_, 3);
		GameObject Num3_ =Instantiate (Resources.Load ("png/Number/Pre/3")) as GameObject;
		Destroy (Num3_, 2);
		GameObject Num2_ =Instantiate (Resources.Load ("png/Number/Pre/2")) as GameObject;
		Destroy (Num2_, 3);
		GameObject Num1_ =Instantiate (Resources.Load ("png/Number/Pre/1_next")) as GameObject;
		Destroy (Num1_, 2);
		Destroy (Num0_p,2);*/
        if (!ReStart())
        {
            GamePlay();
        }
    }

    public void MoveGridDate(Grid last, Grid current)
    {
        DicGrid.Remove(last.GridId);
        DicGrid.Remove(current.GridId);

        DicGrid.Add(last.GridId, current);
        DicGrid.Add(current.GridId, last);

        int t = last.GridId;
        last.GridId = current.GridId;
        current.GridId = t;
    }

    public bool GetGridMoveRange(int last, int current)
    {
        if (GetGridPosX(last) == GetGridPosX(current))
        {
            if (GetGridPosY(last) == GetGridPosY(current) + 1 || GetGridPosY(last) == GetGridPosY(current) - 1)
            {
                return true;
            }
        }
        if (GetGridPosY(last) == GetGridPosY(current))
        {
            if (GetGridPosX(last) == GetGridPosX(current) + 1 || GetGridPosX(last) == GetGridPosX(current) - 1)
            {
                return true;
            }
        }
        return false;
    }

    public int GetGridID(int x, int y)
    {
        return x * 10 + y;
    }

    public int GetGridPosX(int id)
    {
        return id / 10;
    }

    public int GetGridPosY(int id)
    {
        return id % 10;
    }

    public int GetLeft(int id)
    {
        return id - 10;
    }

    public int GetDown(int id)
    {
        return id - 1;
    }

    bool Comparator(int a, int b, int c)
    {
        if (!DicGrid.ContainsKey(a) || !DicGrid.ContainsKey(b) || !DicGrid.ContainsKey(c))
        {
            return false;
        }
        if (DicGrid[a].GridType == DicGrid[b].GridType && DicGrid[b].GridType == DicGrid[c].GridType)
        {
            return true;
        }

        return false;
    }
	public static int temp=0,temp1=0,temp2=0,first=0;
	void exitGame(){
		Application.Quit();  
	}
	void RemoveGrid ()
	{
		Debug.Log ("开始消除");
		for (int x = 0; x < 10; x++) {
			for (int y = 0; y < 10; y++) {
				if (Comparator (GetGridID (x, y), GetGridID (x, y + 1), GetGridID (x, y + 2))) {
					if (!RemoveGridList.Contains (DicGrid [GetGridID (x, y)])) {
						RemoveGridList.Add (DicGrid [GetGridID (x, y)]);
					}
					if (!RemoveGridList.Contains (DicGrid [GetGridID (x, y + 1)])) {
						RemoveGridList.Add (DicGrid [GetGridID (x, y + 1)]);
					}
					if (!RemoveGridList.Contains (DicGrid [GetGridID (x, y + 2)])) {
						RemoveGridList.Add (DicGrid [GetGridID (x, y + 2)]);
					}
				}
				if (Comparator (GetGridID (x, y), GetGridID (x + 1, y), GetGridID (x + 2, y))) {	
					if (!RemoveGridList.Contains (DicGrid [GetGridID (x, y)])) {
						RemoveGridList.Add (DicGrid [GetGridID (x, y)]);
					}
					if (!RemoveGridList.Contains (DicGrid [GetGridID (x + 1, y)])) {
						RemoveGridList.Add (DicGrid [GetGridID (x + 1, y)]);
					}
					if (!RemoveGridList.Contains (DicGrid [GetGridID (x + 2, y)])) {
						RemoveGridList.Add (DicGrid [GetGridID (x + 2, y)]);
					}
				}
			}
		}
		//first = 0;
	


        if (RemoveGridList.Count > 0)
        {
			temp = Random.Range (0, 10);
			if (temp == 1 || temp == 3 || temp == 5 ) {
				if (RemoveGridList.Count == 4 || RemoveGridList.Count == 8) {
					GameObject CreateS = Instantiate (Resources.Load ("Music/A/B/CreatS")) as GameObject;
				} 
				else if (temp == 2 || temp == 6 || temp == 8 ){
					GameObject CreateW = Instantiate (Resources.Load ("Music/A/B/CreatW")) as GameObject;
				}
			}
			if (RemoveGridList.Count == 5) {
					GameObject Colorr = Instantiate (Resources.Load ("Music/A/B/CreatC")) as GameObject;
				}

			temp2++;
			temp1++;
			if(temp1==1)
				Steps--;
			//switch (Steps) {
			//case 14:
			//	GameObject Num14 = Instantiate (Resources.Load ("png/Number/Pre/4")) as GameObject;
			//	break;
			//case 13:
			//	Destroy (Num14);
			//	Image Num13 = Instantiate (Resources.Load ("png/Number/Pre/3")) as Image;
			//	break;
			//case 12:
			//	Destroy (Num13);
			//	Image Num12 = Instantiate (Resources.Load ("png/Number/Pre/2")) as Image;
			//case 11:
			//	Image Num11 = Instantiate (Resources.Load ("png/Number/Pre/1_next")) as Image;
			//case 10:
			//	Image Num10 = Instantiate (Resources.Load ("png/Number/Pre/0_next")) as Image;
			//}
			//}
			if (first == 0) {
				if (Steps == 5) {
					GameObject Dead = Instantiate (Resources.Load ("Music/A/B/Dead5")) as GameObject;
					first++;
				}
			}
			mSteps.text = "Schritt : " + Steps;
			Debug.Log("继续消除！");
            numScore += RemoveGridList.Count*150 ;
            mScore.text = "Note : " + numScore;
            for (int i = 0; i < RemoveGridList.Count; i++)
            {
                DicGrid.Remove(RemoveGridList[i].GridId);
                Destroy(RemoveGridList[i].gameObject);
            }
            CurrentClickGrid = null;
            LastClickGrid = null;
			switch (temp2) {
			case 1: GameObject Warp = Instantiate (Resources.Load ("Music/A/B/First_w")) as GameObject;break;
			case 2: GameObject A =Instantiate (Resources.Load ("Music/A/B/Sec")) as GameObject;break;
			case 3: GameObject B =Instantiate (Resources.Load ("Music/A/B/Thr")) as GameObject;break;
			case 4:	GameObject C =Instantiate (Resources.Load ("Music/A/B/Four")) as GameObject;break;
			case 5:	GameObject D =Instantiate (Resources.Load ("Music/A/B/Five")) as GameObject;break;
			case 6:	GameObject E =Instantiate (Resources.Load ("Music/A/B/Six")) as GameObject;break;
			case 7:	GameObject F =Instantiate (Resources.Load ("Music/A/B/Seeven")) as GameObject;break;
			case 8:	GameObject G =Instantiate (Resources.Load ("Music/A/B/Eight")) as GameObject;break;
			case 9:	GameObject H =Instantiate (Resources.Load ("Music/A/B/Nine")) as GameObject;break;
			}

            RemoveGridList.Clear();
        }
        else
        {
            Debug.Log("循环结束！");
            if (LastClickGrid && CurrentClickGrid)
            {
                LastClickGrid.MoveGrid(LastClickGrid, CurrentClickGrid);
            }
            CurrentClickGrid = null;
            LastClickGrid = null;
			switch (temp1) {
			case 2:
				GameObject Good = Instantiate (Resources.Load ("Prefabs/Good")) as GameObject;
				Image Goodp = Instantiate (Resources.Load ("Pre/Goodp")) as Image;
				//Destroy (Goodp, 1);
				break;
			case 3:
				GameObject Great = Instantiate (Resources.Load ("Prefabs/Great")) as GameObject;
				Image Greatp = Instantiate (Resources.Load ("Pre/Greatp")) as Image;
				//Destroy (Greatp, 1);
				break;
			case 4:
				GameObject Excellent = Instantiate (Resources.Load ("Prefabs/Excellent")) as GameObject;
				Image Excellentp = Instantiate (Resources.Load ("Pre/Excellentp")) as Image;
				//Destroy (Excellentp, 1);
				break;
			case 5:
				GameObject Amazing = Instantiate (Resources.Load ("Prefabs/Amazing")) as GameObject;
				Image Amazingp = Instantiate (Resources.Load ("Pre/Amazingp")) as Image;
				break;
			case 6:
				GameObject Unbelievable = Instantiate (Resources.Load ("Prefabs/Unbelievable")) as GameObject;
				Image Unbelievablep = Instantiate (Resources.Load ("Pre/Unbelievablep")) as Image;
				break;
			case 7:
				GameObject Unbelievable1 = Instantiate (Resources.Load ("Prefabs/Unbelievable")) as GameObject;
				Image Unbelievablep1 = Instantiate (Resources.Load ("Pre/Unbelievablep")) as Image;
				break;
			case 8:
				GameObject Unbelievable2 = Instantiate (Resources.Load ("Prefabs/Unbelievable")) as GameObject;
				Image Unbelievablep2 = Instantiate (Resources.Load ("Pre/Unbelievablep")) as Image;
				break;
			case 9:
				GameObject Unbelievable3 = Instantiate (Resources.Load ("Prefabs/Unbelievable")) as GameObject;
				Image Unbelievablep3 = Instantiate (Resources.Load ("Pre/Unbelievablep")) as Image;
				break;
			}
			temp = 0;
			temp1 = temp;
			temp2 = temp;
            return;
        }
        AllGridMoveDown();
    }
	public bool getRandom(){
		int i = Random.Range (0, 1);
	if (i == 0)
			return false;
	else
			return true;
	}
    void AllGridMoveDown()
    {
        Debug.Log("下移");
        for (int x = 0; x < 10; x++)
        {
            int NullGridPos = -1;
            for (int y = 0; y < 10; y++)
            {
                if (!DicGrid.ContainsKey(GetGridID(x, y)))
                {
                    if (NullGridPos == -1)
                    {
                        NullGridPos = y;
                    }
                }
                else if (NullGridPos != -1)
                {
                    Vector2 pos = DicGrid[GetGridID(x, y)].transform.localPosition;
                    pos.y = NullGridPos * 55;
                    DicGrid[GetGridID(x, y)].TragetPos = pos;
                    if (!IsMove.Contains(GetGridID(x, NullGridPos)))
                    {
                        IsMove.Add(GetGridID(x, NullGridPos));
                    }
                    Grid t = DicGrid[GetGridID(x, y)];
                    DicGrid.Remove(GetGridID(x, y));
                    DicGrid.Add(GetGridID(x, NullGridPos), t);
                    t.GridId = GetGridID(x, NullGridPos);
                    NullGridPos += 1;
                }
            }
        }
        IsDownKey = true;
    }

    void ReSetNullGrid()
    {
        for (int i = 0; i < 10; i++)
        {
            for (int j = 0; j < 10; j++)
            {
                if (!DicGrid.ContainsKey(GetGridID(i, j)))
                {
                    GameObject grid = Instantiate(Resources.Load("Prefabs/Grid")) as GameObject;
                    Grid mgrid = grid.AddComponent<Grid>();
                    mgrid.GridId = GetGridID(i, j);
                    grid.transform.SetParent(GridCentrerTransform, false);
                    DicGrid[mgrid.GridId] = mgrid;
                    mgrid.GridType = GetNewType(mgrid.GridId);
                    mgrid.Init();
                }
            }
        }
        RemoveGrid();
    }

    bool ReStart()
    {
        for (int x = 0; x < 10; x++)
        {
            for (int y = 0; y < 10; y++)
            {
                if (
                    //尖括号种类消除
                    Comparator(GetGridID(x, y), GetGridID(x - 1, y - 1), GetGridID(x - 1, y + 1))
                    || Comparator(GetGridID(x, y), GetGridID(x + 1, y + 1), GetGridID(x - 1, y + 1))
                    || Comparator(GetGridID(x, y), GetGridID(x + 1, y - 1), GetGridID(x + 1, y + 1))
                    || Comparator(GetGridID(x, y), GetGridID(x - 1, y - 1), GetGridID(x - 1, y + 1))
                    //感叹号种类消除
                    || Comparator(GetGridID(x, y), GetGridID(x - 2, y), GetGridID(x - 3, y))
                    || Comparator(GetGridID(x, y), GetGridID(x + 2, y), GetGridID(x + 3, y))
                    || Comparator(GetGridID(x, y), GetGridID(x, y - 2), GetGridID(x, y - 3))
                    || Comparator(GetGridID(x, y), GetGridID(x, y + 2), GetGridID(x, y + 3))
                    //小拐弯种类
                    || Comparator(GetGridID(x, y), GetGridID(x - 1, y - 1), GetGridID(x - 1, y - 2))
                    || Comparator(GetGridID(x, y), GetGridID(x + 1, y - 1), GetGridID(x + 1, y - 2))

                    || Comparator(GetGridID(x, y), GetGridID(x - 1, y + 1), GetGridID(x - 1, y + 2))
                    || Comparator(GetGridID(x, y), GetGridID(x + 1, y + 1), GetGridID(x + 1, y + 2))

                    || Comparator(GetGridID(x, y), GetGridID(x - 1, y - 1), GetGridID(x - 2, y - 1))
                    || Comparator(GetGridID(x, y), GetGridID(x - 1, y + 1), GetGridID(x - 2, y + 1))

                    || Comparator(GetGridID(x, y), GetGridID(x + 1, y - 1), GetGridID(x + 2, y - 1))
                    || Comparator(GetGridID(x, y), GetGridID(x + 1, y + 1), GetGridID(x + 2, y + 1))
                    )
                {
                    return true;
                }
            }
        }

        return false;
    }

    private bool IsDownKey = false;

    int GetNewType(int gridID)
    {
        int LeftType = 0;
        int DownType = 0;
        if (GetGridPosY(gridID) > 1)
        {
            if (DicGrid[GetDown(gridID)].GridType == DicGrid[GetDown(GetDown(gridID))].GridType)
            {
                DownType = DicGrid[GetDown(gridID)].GridType;
            }
        }
        if (GetGridPosX(gridID) > 1)
        {
            if (DicGrid[GetLeft(gridID)].GridType == DicGrid[GetLeft(GetLeft(gridID))].GridType)
            {
                LeftType = DicGrid[GetLeft(gridID)].GridType;
            }
        }
        if (GetGridPosY(gridID) > 1 || GetGridPosX(gridID) > 1)
        {
            return Range(DownType, LeftType);
        }
        return Random.Range(1, typeNum);
    }

    int Range(int down, int left)
    {
        int NewType = Random.Range(1, typeNum);
        if (down != NewType && left != NewType)
        {
            return NewType;
        }
        return Range(down, left);
    }
    
    #endregion

    #region 积分上传
    private Text ScoreUp = null;
    private string Name = "";
    private InputField input = null;
    public void BtnClickSubmit()
    {
        GameStartTransform.gameObject.SetActive(true);
        GamePlayTransform.gameObject.SetActive(false);
        RankingTransform.gameObject.SetActive(false);
        ScoreUpdateTransform.gameObject.SetActive(false);
        Name = input.text;
        SendMessageAddRanking(Name, numScore);
        Debug.Log(Name);
//

 //与服务器对接上传积分

// 

    }

    #endregion

    #region 排行榜
    
    void ShowRanking()
    {
        for (int i = 0; i < listinfo.Count; i++)
        {
            GameObject item = Instantiate(Item.gameObject);
            item.gameObject.SetActive(true);
            item.transform.SetParent(Item.parent, false);
            ListTopTransform.Add(item.transform);
            item.transform.Find("Number").GetComponent<Text>().text = (i + 1).ToString();
            item.transform.Find("Name").GetComponent<Text>().text = listinfo[i].name;
            item.transform.Find("Score").GetComponent<Text>().text = listinfo[i].integral.ToString();
        }
    }

    public void BtnClickCloseRanking()
    {
        for (int i = 0; i < ListTopTransform.Count; i++)
        {
            Destroy(ListTopTransform[i].gameObject);
        }
        ListTopTransform.Clear();
        GameStartTransform.gameObject.SetActive(true);
        GamePlayTransform.gameObject.SetActive(false);
        RankingTransform.gameObject.SetActive(false);
        ScoreUpdateTransform.gameObject.SetActive(false);
    }

    #endregion

    #region 消息机制
    /// <summary>
    /// 消息回调监听
    /// </summary>
    /// <param name="cmdId">消息ID</param>
    /// <param name="param1">参数1</param>
    /// <param name="param2">参数2</param>
    public void OnReceiveData(uint cmdId, object param1, object param2)
    {
        Debug.Log("消息监听1：" + cmdId);
        switch (cmdId)
        {
            case NetMessageDef.ResGetTopList:
                listinfo.Clear();
                protos.integral.ResGetTopList list = param1 as protos.integral.ResGetTopList;
                foreach (protos.integral.TopInfo info in list.topInfo)
                {
                    listinfo.Add(info);
                }
                ShowRanking();
                break;
        }
    } 

    /// <summary>请求排行榜列表</summary>
    void SendMessageGetRankingList(int num)
    {
        protos.integral.ReqGetTopListSan san = new protos.integral.ReqGetTopListSan();
        san.topNums = num;
        GameServerMgr.GetInstance().SendMessage(new MuffinMsg((int)NetMessageDef.ReqGetTopListSan, san));
    }

    void SendMessageAddRanking(string name,int score)
    {
        protos.integral.ReqAddTop top = new protos.integral.ReqAddTop();
        top.userName = name;
        top.integral = score;
        GameServerMgr.GetInstance().SendMessage(new MuffinMsg((int)NetMessageDef.ReqAddTop, top));
    }


    #endregion
}

using UnityEngine;
using System.Collections;
using UnityEngine.UI;
using UnityEngine.EventSystems;

//is Grid Script
public class Grid : MonoBehaviour,IPointerClickHandler
{
	public int GridId;
	private int GridSize = 55;
	private int Gridx;
	private int Gridy;
	public int GridType = 0;
	private int Speed = 200;
	public bool Special =false; 

	public Vector2 TragetPos = Vector2.zero;


	public void Init () 
	{
		name = GridId.ToString();
		Gridx = GridCenter.Instance.GetGridPosX(GridId);
		Gridy = GridCenter.Instance.GetGridPosY(GridId);
		transform.localPosition = new Vector3(Gridx * GridSize, Gridy * GridSize, 0);
		TragetPos = transform.localPosition;
		Image img = this.GetComponent<Image>();
		switch(GridType)
		{
		case 1:
			img.overrideSprite = GridCenter.Instance.s1;
			break;
		case 2:
			img.overrideSprite = GridCenter.Instance.s2;
			break;
		case 3:
			img.overrideSprite = GridCenter.Instance.s3;
			break;
		case 4:
			img.overrideSprite = GridCenter.Instance.s4;
			break;
		case 5:
			img.overrideSprite = GridCenter.Instance.s5;
			break;
		}
	}

	void Update () 
	{
		if (transform.localPosition.x == TragetPos.x && transform.localPosition.y == TragetPos.y)
		{
			if (GridCenter.Instance.IsMove.Contains(GridId))
			{
				GridCenter.Instance.IsMove.Remove(GridId);
			}
		}
		if (transform.localPosition.x != TragetPos.x)
		{
			if (transform.localPosition.x > TragetPos.x)
			{
				Vector2 pos = transform.localPosition;
				pos.x -= (Speed * Time.deltaTime);
				pos.x = pos.x < TragetPos.x ? TragetPos.x : pos.x;
				transform.localPosition = pos;
			}
			else
			{
				Vector2 pos = transform.localPosition;
				pos.x += (Speed * Time.deltaTime);
				pos.x = pos.x > TragetPos.x ? TragetPos.x : pos.x;
				transform.localPosition = pos;
			}
		}
		if (transform.localPosition.y != TragetPos.y)
		{
			if (transform.localPosition.y > TragetPos.y)
			{
				Vector2 pos = transform.localPosition;
				pos.y -= (Speed * Time.deltaTime);
				pos.y = pos.y < TragetPos.y ? TragetPos.y : pos.y;
				transform.localPosition = pos;
			}
			else
			{
				Vector2 pos = transform.localPosition;
				pos.y += (Speed * Time.deltaTime);
				pos.y = pos.y > TragetPos.y ? TragetPos.y : pos.y;
				transform.localPosition = pos;
			}
		}
	}

	public void MoveGrid(Grid last,Grid current)
	{
		if (GridCenter.Instance.GetGridMoveRange(last.GridId, current.GridId))
		{
			last.TragetPos = current.transform.localPosition;
			current.TragetPos = last.transform.localPosition;
			if (!GridCenter.Instance.IsMove.Contains(GridId))
			{
				GridCenter.Instance.IsMove.Add(GridId);
			}
			GridCenter.Instance.MoveGridDate(last, current);
			GridCenter.Instance.RemoveKye = true;
		}
		else
		{
			GridCenter.Instance.LastClickGrid = null;
			GridCenter.Instance.CurrentClickGrid = null; 
		}
	}

	public void OnPointerClick(PointerEventData eventData)
	{
		GameObject Click=Instantiate (Resources.Load ("Music/A/B/Click")) as GameObject;
		if (GridCenter.Instance.IsMove.Count !=0)
		{
			return;
		}
		Debug.Log("Click:"+name);
		if (GridCenter.Instance.LastClickGrid != this)
		{
			if (GridCenter.Instance.LastClickGrid != null)
			{
				MoveGrid(GridCenter.Instance.LastClickGrid,this);
				GridCenter.Instance.CurrentClickGrid = this;
				return;
			}
			GridCenter.Instance.LastClickGrid = this;
		}

	}
}

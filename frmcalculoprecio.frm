VERSION 5.00
Begin VB.Form frmcalculoprecio 
   BackColor       =   &H00C0FFC0&
   Caption         =   "Calculo de Precios"
   ClientHeight    =   5610
   ClientLeft      =   60
   ClientTop       =   450
   ClientWidth     =   5940
   LinkTopic       =   "Form1"
   ScaleHeight     =   5610
   ScaleWidth      =   5940
   StartUpPosition =   3  'Windows Default
   Begin VB.TextBox txtmayorista 
      Alignment       =   1  'Right Justify
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   14.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   615
      Left            =   2280
      TabIndex        =   5
      Top             =   3840
      Width           =   855
   End
   Begin VB.TextBox txtgremio 
      Alignment       =   1  'Right Justify
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   14.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   615
      Left            =   2280
      TabIndex        =   4
      Top             =   2640
      Width           =   855
   End
   Begin VB.TextBox txtPublico 
      Alignment       =   1  'Right Justify
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   14.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   615
      Left            =   2280
      TabIndex        =   3
      Top             =   1440
      Width           =   855
   End
   Begin VB.Label lblleyenda 
      AutoSize        =   -1  'True
      BackColor       =   &H00C0FFC0&
      Caption         =   "Porcentajes de Precios"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   18
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   525
      Index           =   6
      Left            =   840
      TabIndex        =   9
      Top             =   120
      Width           =   3960
   End
   Begin VB.Label lblleyenda 
      AutoSize        =   -1  'True
      BackColor       =   &H00C0FFC0&
      Caption         =   "%"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   18
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   525
      Index           =   5
      Left            =   3360
      TabIndex        =   8
      Top             =   3960
      Width           =   300
   End
   Begin VB.Label lblleyenda 
      AutoSize        =   -1  'True
      BackColor       =   &H00C0FFC0&
      Caption         =   "%"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   18
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   525
      Index           =   4
      Left            =   3360
      TabIndex        =   7
      Top             =   2760
      Width           =   300
   End
   Begin VB.Label lblleyenda 
      AutoSize        =   -1  'True
      BackColor       =   &H00C0FFC0&
      Caption         =   "%"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   18
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   525
      Index           =   3
      Left            =   3360
      TabIndex        =   6
      Top             =   1560
      Width           =   300
   End
   Begin VB.Label lblleyenda 
      AutoSize        =   -1  'True
      BackColor       =   &H00C0FFC0&
      Caption         =   "Mayorista"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   18
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   525
      Index           =   2
      Left            =   240
      TabIndex        =   2
      Top             =   3960
      Width           =   1725
   End
   Begin VB.Label lblleyenda 
      AutoSize        =   -1  'True
      BackColor       =   &H00C0FFC0&
      Caption         =   "Gremio"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   18
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   525
      Index           =   1
      Left            =   240
      TabIndex        =   1
      Top             =   2760
      Width           =   1200
   End
   Begin VB.Label lblleyenda 
      AutoSize        =   -1  'True
      BackColor       =   &H00C0FFC0&
      Caption         =   "Publico"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   18
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   525
      Index           =   0
      Left            =   240
      TabIndex        =   0
      Top             =   1560
      Width           =   1170
   End
End
Attribute VB_Name = "frmcalculoprecio"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
